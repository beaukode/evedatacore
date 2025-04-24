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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import SolarsystemName from "@/components/ui/SolarsystemName";
import { useMudSql } from "@/contexts/AppContext";
import { Character } from "@shared/mudsql";
import { filterInProps, shorten } from "@/tools";
import BasicListItem from "@/components/ui/BasicListItem";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";
import Error404 from "@/pages/Error404";
import { getGateConfig } from "./lib/getGateConfig";
import { isGateManaged } from "./lib/utils";
import Setup from "./components/Setup";

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

const Administrator: React.FC = () => {
  const [character, setCharacter] = React.useState<Character | null>(null);
  const [corporation, setCorporation] = React.useState<number>(0);
  const { id } = useParams();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["GatesDapp", "Smartgate", id],
    queryFn: async () => mudSql.getGate(id || ""),
    enabled: !!id,
  });

  const gate = query.data;

  const queryDestination = useQuery({
    queryKey: ["GatesDapp", "Smartgate", gate?.destinationId],
    queryFn: async () =>
      mudSql.getGate(gate?.destinationId || "").then((r) => r ?? null),
    enabled: !!gate?.destinationId,
  });

  const destination = queryDestination.data;

  const queryCharacters = useQuery({
    queryKey: ["GatesDapp", "Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
    staleTime: 1000 * 60 * 15,
    enabled: !!id,
  });

  const characters = queryCharacters.data || [];

  const queryGateConfig = useQuery({
    queryKey: ["GatesDapp", "SmartgateConfig", id],
    queryFn: async () => getGateConfig(mudSql)(id || "").then((r) => r ?? null),
    enabled: !!id,
  });

  const config = queryGateConfig.data;

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

  console.log("corporations", corporations.length);

  const title = gate
    ? gate.name || shorten(gate.id) || "Gate not found"
    : "...";

  const isLoading =
    query.isLoading || queryDestination.isLoading || queryCharacters.isLoading;

  if (!gate && !isLoading) return <Error404 hideBackButton />;

  return (
    <Box m={2}>
      <PaperLevel1 title={title} loading={isLoading} backButton>
        {!isLoading && gate && (
          <>
            <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
              <BasicListItem title="Location">
                <SolarsystemName solarSystemId={gate.solarSystemId} inline />
              </BasicListItem>
              <BasicListItem title="Destination">
                {destination ? (
                  <>
                    <SolarsystemName
                      solarSystemId={destination.solarSystemId}
                      inline
                    />{" "}
                    ({destination.name})
                  </>
                ) : (
                  "None"
                )}
              </BasicListItem>
            </List>
            {isGateManaged(gate) && config ? (
              <>
                <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
                  <BasicListItem title="Default rule">
                    DENY{" "}
                    <ButtonWeb3Interaction
                      title="Switch to ALLOW"
                      onClick={() => {}}
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
                    <TableRow>
                      <TableCell>beauKode</TableCell>
                      <TableCell>
                        <ButtonWeb3Interaction
                          title="Remove"
                          icon="delete"
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Corporation #1000167</TableCell>
                      <TableCell>
                        <ButtonWeb3Interaction
                          title="Remove"
                          icon="delete"
                          onClick={() => {}}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box sx={{ m: 2, display: "flex", alignItems: "center" }}>
                  <Autocomplete
                    options={characters || []}
                    value={character}
                    getOptionLabel={(c) =>
                      `${c.name} [Corp: ${c.corpId}] ${shorten(c.address)}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
                    disabled={queryCharacters.isFetching}
                    filterOptions={filterOptions}
                    openOnFocus
                    fullWidth
                  />
                  <ButtonWeb3Interaction
                    title="Add"
                    icon="add"
                    onClick={() => {}}
                  />
                </Box>
                <Box sx={{ m: 2, display: "flex", alignItems: "center" }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="select-corporation-label">
                      Corporation
                    </InputLabel>
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
                    onClick={() => {}}
                  />
                </Box>
              </>
            ) : (
              <Setup
                gate={gate}
                onSuccess={() => {
                  query.refetch();
                  queryGateConfig.refetch();
                }}
              />
            )}
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default Administrator;
