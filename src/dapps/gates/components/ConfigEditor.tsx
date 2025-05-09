import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FilterOptionsState,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
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
import BasicListItem from "@/components/ui/BasicListItem";
import { filterInProps, shorten } from "@/tools";
import { GateConfig, getGateConfig } from "../lib/getGateConfig";
import { configDiff, getConfigSystemId } from "../lib/utils";
import { updateConfig } from "../lib/updateConfig";

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
  const [config, setConfig] = React.useState<GateConfig>();
  const pushTrackingEvent = usePushTrackingEvent();
  const mudSql = useMudSql();
  const mudWeb3 = useMudWeb3();

  const queryGateConfig = useQuery({
    queryKey: ["GatesDapp", "SmartgateConfig", gate.id],
    queryFn: async () => getGateConfig(mudSql)(gate.id).then((r) => r ?? null),
  });

  React.useEffect(() => {
    if (queryGateConfig.data) {
      setConfig(queryGateConfig.data);
    }
  }, [queryGateConfig.data]);

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

  const diff = React.useMemo(() => {
    if (!config || !queryGateConfig.data) return;
    return configDiff(queryGateConfig.data, config);
  }, [config, queryGateConfig.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!diff) return;

      return await updateConfig(mudWeb3, {
        gateId: BigInt(gate.id),
        configSystemId,
        ...diff,
      });
    },
    onSuccess: async () => {
      pushTrackingEvent(`web3://dapp.gates/config`);
      await queryGateConfig.refetch();
    },
    retry: false,
  });

  if (!config) return null;

  return (
    <>
      <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
        <BasicListItem title="Default access rule" disableGutters>
          <FormControlLabel
            control={
              <Switch
                checked={config.defaultRule}
                onChange={(e) => {
                  setConfig((s) => {
                    if (!s) return s;
                    return {
                      ...s,
                      defaultRule: e.target.checked,
                    };
                  });
                }}
              />
            }
            label={config.defaultRule ? "Allow" : "Deny"}
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
              <TableCell align="right">
                <IconButton
                  color="primary"
                  disabled={mutation.isPending}
                  title="Remove"
                  onClick={() => {
                    setConfig((s) => {
                      if (!s) return s;
                      return {
                        ...s,
                        charactersExceptions: s.charactersExceptions.filter(
                          (c) => c !== id
                        ),
                      };
                    });
                  }}
                >
                  <DeleteIcon fontSize="small" style={{ marginRight: 0 }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {config.corporationsExceptions.map((id) => (
            <TableRow key={id}>
              <TableCell>Corporation #{id}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  disabled={mutation.isPending}
                  title="Remove"
                  onClick={() => {
                    setConfig((s) => {
                      if (!s) return s;
                      return {
                        ...s,
                        corporationsExceptions: s.corporationsExceptions.filter(
                          (c) => c !== id
                        ),
                      };
                    });
                  }}
                >
                  <DeleteIcon fontSize="small" style={{ marginRight: 0 }} />
                </IconButton>
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
        <IconButton
          color="primary"
          disabled={mutation.isPending}
          title="Add"
          onClick={() => {
            if (!character) return;
            setConfig((s) => {
              if (!s) return s;
              if (s.charactersExceptions.includes(character.id)) return s;
              return {
                ...s,
                charactersExceptions: [...s.charactersExceptions, character.id],
              };
            });
          }}
        >
          <AddIcon fontSize="small" style={{ marginRight: 0 }} />
        </IconButton>
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
        <IconButton
          color="primary"
          disabled={mutation.isPending}
          title="Add"
          onClick={() => {
            if (!corporation) return;
            setConfig((s) => {
              if (!s) return s;
              if (s.corporationsExceptions.includes(corporation.toString()))
                return s;
              return {
                ...s,
                corporationsExceptions: [
                  ...s.corporationsExceptions,
                  corporation.toString(),
                ],
              };
            });
          }}
        >
          <AddIcon fontSize="small" style={{ marginRight: 0 }} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", mx: 2, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="warning"
          startIcon={<SaveIcon />}
          onClick={() => {
            mutation.mutate();
          }}
          loading={mutation.isPending}
          disabled={!diff}
        >
          Save
        </Button>
      </Box>
      <Web3ErrorAlert sx={{ mt: 2 }} error={mutation.error} />
      <Web3SuccessAlert sx={{ mt: 2 }} receipt={mutation.data} />
    </>
  );
};

export default ConfigEditor;
