import React from "react";
import {
  Autocomplete,
  Box,
  FilterOptionsState,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash-es";
import {
  useMudSql,
  useMudWeb3,
  usePushTrackingEvent,
} from "@/contexts/AppContext";
import { Character, Gate } from "@shared/mudsql";
import { Web3ErrorAlert } from "@/components/web3/Web3ErrorAlert";
import { Web3SuccessAlert } from "@/components/web3/Web3SuccessAlert";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";
import BasicListItem from "@/components/ui/BasicListItem";
import { filterInProps, shorten } from "@/tools";
import { getGateConfig } from "../lib/getGateConfig";
import { getConfigSystemId } from "../lib/utils";
import { setDefaultRule } from "../lib/setDefaultRule";
import { addCharacterException } from "../lib/addCharacterException";
import { removeCharacterException } from "../lib/removeCharacterException";
import { addCorpException } from "../lib/addCorpException";
import { removeCorpException } from "../lib/removeCorpException";

type MutationCommandAction =
  | "toggleDefaultRule"
  | "addCharacter"
  | "removeCharacter"
  | "addCorporation"
  | "removeCorporation";

type BaseMutationCommand = {
  action: MutationCommandAction;
};

type MutationCommandToggleDefaultRule = BaseMutationCommand & {
  action: "toggleDefaultRule";
};

type MutationCommandAddCharacter = BaseMutationCommand & {
  action: "addCharacter";
  characterId: bigint;
};

type MutationCommandRemoveCharacter = BaseMutationCommand & {
  action: "removeCharacter";
  characterId: bigint;
};

type MutationCommandAddCorporation = BaseMutationCommand & {
  action: "addCorporation";
  corporationId: bigint;
};

type MutationCommandRemoveCorporation = BaseMutationCommand & {
  action: "removeCorporation";
  corporationId: bigint;
};

type MutationCommand =
  | MutationCommandToggleDefaultRule
  | MutationCommandAddCharacter
  | MutationCommandRemoveCharacter
  | MutationCommandAddCorporation
  | MutationCommandRemoveCorporation;

const MAX_RESULTS = 500;
function filterOptions(
  options: Character[],
  state: FilterOptionsState<Character>
) {
  const filtered = filterInProps(options, state.inputValue, [
    "name",
    "address",
  ]);

  const limitedResults = filtered.slice(0, MAX_RESULTS);

  if (filtered.length > MAX_RESULTS) {
    limitedResults.push({
      address: "0x",
      name: "There are more results, be more specific",
      corpId: 0,
      id: "",
      createdAt: 0,
    });
  }
  return limitedResults;
}

const configSystemId = getConfigSystemId();

interface ConfigEditorProps {
  gate: Gate;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ gate }) => {
  const [character, setCharacter] = React.useState<Character | null>(null);
  const [corporation, setCorporation] = React.useState<number>(0);
  const pushTrackingEvent = usePushTrackingEvent();
  const mudSql = useMudSql();
  const mudWeb3 = useMudWeb3();

  const queryGateConfig = useQuery({
    queryKey: ["GatesDapp", "SmartgateConfig", gate.id],
    queryFn: async () => getGateConfig(mudSql)(gate.id).then((r) => r ?? null),
  });

  const config = queryGateConfig.data;

  const queryCharacters = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
    staleTime: 1000 * 60 * 15,
  });

  const characters = queryCharacters.data || [];

  const charactersById = React.useMemo(() => {
    return keyBy(queryCharacters.data || [], "id");
  }, [queryCharacters.data]);

  const corporations = React.useMemo(() => {
    const map = (queryCharacters.data || []).reduce(
      (acc, c) => {
        acc[c.corpId] = true;
        return acc;
      },
      [] as Record<number, boolean>
    );
    return Object.keys(map).map(Number);
  }, [queryCharacters.data]);

  const mutation = useMutation({
    mutationFn: async (command: MutationCommand) => {
      if (!config) return;

      if (command.action === "toggleDefaultRule") {
        return setDefaultRule(mudWeb3, {
          gateId: BigInt(gate.id),
          defaultRule: !config.defaultRule,
          configSystemId,
        });
      }
      if (command.action === "addCharacter") {
        return addCharacterException(mudWeb3, {
          gateId: BigInt(gate.id),
          characterId: command.characterId,
          configSystemId,
        });
      }
      if (command.action === "addCorporation") {
        return addCorpException(mudWeb3, {
          gateId: BigInt(gate.id),
          corpId: command.corporationId,
          configSystemId,
        });
      }
      if (command.action === "removeCharacter") {
        return removeCharacterException(mudWeb3, {
          gateId: BigInt(gate.id),
          characterId: command.characterId,
          configSystemId,
        });
      }
      if (command.action === "removeCorporation") {
        return removeCorpException(mudWeb3, {
          gateId: BigInt(gate.id),
          corpId: command.corporationId,
          configSystemId,
        });
      }
    },
    onSuccess() {
      pushTrackingEvent(`web3://dapp.gates/config`);
      queryGateConfig.refetch();
    },
    retry: false,
  });

  if (!config) return null;

  return (
    <>
      <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
        <BasicListItem title="Default rule">
          {config.defaultRule ? "ALLOW" : "DENY"}
          <ButtonWeb3Interaction
            title={config.defaultRule ? "Switch to DENY" : "Switch to ALLOW"}
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate({
                action: "toggleDefaultRule",
              });
            }}
          />
        </BasicListItem>
      </List>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Exception list</TableCell>
            <TableCell width={50}>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {config.charactersExceptions.map((id) => (
            <TableRow key={id}>
              <TableCell>
                {queryCharacters.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    {charactersById[id]?.name} [Corp:{" "}
                    {charactersById[id]?.corpId}]{" "}
                    {shorten(charactersById[id]?.address)}
                  </>
                )}
              </TableCell>
              <TableCell>
                <ButtonWeb3Interaction
                  title="Remove"
                  icon="delete"
                  loading={mutation.isPending}
                  onClick={() => {
                    mutation.mutate({
                      action: "removeCharacter",
                      characterId: BigInt(id),
                    });
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {config.corporationsExceptions.map((id) => (
            <TableRow key={id}>
              <TableCell>Corporation #{id}</TableCell>
              <TableCell>
                <ButtonWeb3Interaction
                  title="Remove"
                  icon="delete"
                  loading={mutation.isPending}
                  onClick={() => {
                    mutation.mutate({
                      action: "removeCorporation",
                      corporationId: BigInt(id),
                    });
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ m: 2, display: "flex", alignItems: "center" }}>
        <Autocomplete
          options={characters || []}
          value={character}
          getOptionLabel={(c) =>
            `${c.name} [Corp: ${c.corpId}] ${shorten(c.address)}`
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, newValue) => setCharacter(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Add character" />
          )}
          getOptionDisabled={(c) => c.id === ""}
          renderOption={(props, c) => (
            <li
              {...props}
              key={c.id}
              style={{
                fontStyle: c.id === "" ? "italic" : "normal",
              }}
            >
              {c.id === ""
                ? `${c.name}`
                : `${c.name} [Corp: ${c.corpId}] ${shorten(c.address)}`}
            </li>
          )}
          disabled={queryCharacters.isLoading}
          filterOptions={filterOptions}
          openOnFocus
          fullWidth
        />
        <ButtonWeb3Interaction
          title="Add"
          icon="add"
          loading={mutation.isPending}
          onClick={() => {
            if (!character) return;
            mutation.mutate({
              action: "addCharacter",
              characterId: BigInt(character.id),
            });
          }}
        />
      </Box>
      <Box sx={{ m: 2, display: "flex", alignItems: "center" }}>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="select-corporation-label">Corporation</InputLabel>
          <Select
            labelId="select-corporation-label"
            id="select-corporation"
            value={corporation}
            onChange={(e) => setCorporation(Number(e.target.value))}
            label="Corporation"
          >
            <MenuItem value={0}>Select a corporation</MenuItem>
            {corporations?.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ButtonWeb3Interaction
          title="Add"
          icon="add"
          loading={mutation.isPending}
          onClick={() => {
            if (!corporation) return;
            mutation.mutate({
              action: "addCorporation",
              corporationId: BigInt(corporation),
            });
          }}
        />
      </Box>
      <Web3ErrorAlert error={mutation.error} />
      <Web3SuccessAlert receipt={mutation.data} />
    </>
  );
};

export default ConfigEditor;
