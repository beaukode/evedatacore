import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import DataTable, { DataTableContext } from "@/components/DataTable";
import DisplayOwner from "@/components/DisplayOwner";
import DisplayAssembly from "@/components/DisplayAssembly";
import { filterInProps, shorten, tsToDateTime } from "@/tools";
import DisplaySolarsystem from "@/components/DisplaySolarsystem";
import useQuerySearch from "@/tools/useQuerySearch";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import { smartAssemblyStates } from "@/constants";

const columns = ["Assembly", "Owner", "Solar system", "Anchored At"];

const ExploreAssemblies: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    typeId: "0",
    stateId: "0",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Smartassemblies"],
    queryFn: async () => mudSql.listAssemblies(),
    staleTime: 1000 * 60,
  });

  const smartassemblies = React.useMemo(() => {
    if (!query.data) return [];
    const iTypeId = parseInt(search.typeId, 10);
    const iStateId = parseInt(search.stateId, 10);
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["name", "id", "ownerName", "ownerId"],
      (sa) => {
        return (
          (sa.typeId === iTypeId || iTypeId === 0) &&
          (sa.state === iStateId || iStateId === 0)
        );
      }
    );
  }, [query.data, debouncedSearch.text, search.typeId, search.stateId]);

  const itemContent = React.useCallback(
    (
      _: number,
      sa: (typeof smartassemblies)[number],
      context: DataTableContext
    ) => {
      if (context.isScrolling) {
        return (
          <React.Fragment key={sa.id}>
            <TableCell>
              <Box display="flex" alignItems="center">
                <DisplayAssemblyIcon typeId={sa.typeId} stateId={sa.state} />
                <Box sx={{ px: 1, py: 0.75, lineHeight: "24.5px" }}>
                  {sa.name ? sa.name : shorten(sa.id)}
                </Box>
              </Box>
            </TableCell>
            <TableCell
              sx={{ height: 49.5, px: 3, py: 1.5, lineHeight: "24.5px" }}
            >
              {sa.ownerName}
            </TableCell>
            <TableCell>
              <DisplaySolarsystem solarSystemId={sa.solarSystemId} />
            </TableCell>
            <TableCell>{tsToDateTime(sa.anchoredAt)}</TableCell>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={sa.id}>
            <TableCell>
              <Box display="flex" alignItems="center">
                <DisplayAssemblyIcon
                  typeId={sa.typeId}
                  stateId={sa.state}
                  tooltip
                />
                <DisplayAssembly name={sa.name} id={sa.id} />
              </Box>
            </TableCell>
            <TableCell>
              <DisplayOwner name={sa.ownerName} address={sa.ownerId} />
            </TableCell>
            <TableCell>
              <DisplaySolarsystem solarSystemId={sa.solarSystemId} />
            </TableCell>
            <TableCell>{tsToDateTime(sa.anchoredAt)}</TableCell>
          </React.Fragment>
        );
      }
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Assemblies</title>
      </Helmet>
      <Box p={2} flexGrow={1} overflow="hidden">
        <Paper
          elevation={1}
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" alignItems="flex-end">
            <TextField
              sx={{ minWidth: 200 }}
              fullWidth
              label="Search"
              value={search.text}
              onChange={(e) =>
                setSearch(
                  "text",
                  e.currentTarget.value.substring(0, 255).toLowerCase()
                )
              }
            />
            <FormControl
              variant="standard"
              sx={{ width: 220, flexShrink: 0, ml: 2 }}
            >
              <InputLabel id="select-type-label">Type</InputLabel>
              <Select
                labelId="select-type-label"
                id="select-type"
                value={search.typeId}
                variant="standard"
                onChange={(e) => {
                  setSearch("typeId", e.target.value);
                }}
                label="Type"
                fullWidth
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="84955">SmartGate</MenuItem>
                <MenuItem value="84556">SmartTurret</MenuItem>
                <MenuItem value="77917">SmartStorageUnit</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="standard"
              sx={{ width: 150, flexShrink: 0, ml: 2 }}
            >
              <InputLabel id="select-state-label">State</InputLabel>
              <Select
                labelId="select-state-label"
                id="select-state"
                value={search.stateId}
                variant="standard"
                onChange={(e) => {
                  setSearch("stateId", e.target.value);
                }}
                label="State"
                fullWidth
              >
                <MenuItem value="0">Any</MenuItem>
                {Object.entries(smartAssemblyStates).map(([id, name]) => (
                  <MenuItem value={`${id}`}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ textWrap: "nowrap", ml: 2 }}>
              <Typography variant="caption" color="textPrimary">
                {smartassemblies.length} assemblies
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <LinearProgress
              sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
            />
          </Box>
          <DataTable
            data={smartassemblies}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Paper>
      </Box>
    </>
  );
};

export default ExploreAssemblies;
