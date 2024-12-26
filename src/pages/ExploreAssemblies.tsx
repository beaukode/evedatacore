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
  Skeleton,
} from "@mui/material";

import DataTable, { DataTableContext } from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getSmartassemblies } from "../api/stillness";
import DisplayOwner from "../components/DisplayOwner";
import DisplayAssembly from "../components/DisplayAssembly";
import { filterInProps, shorten } from "../tools";
import DisplaySolarsystem from "../components/DisplaySolarsystem";
import useQuerySearch from "../tools/useQuerySearch";
import DisplayAssemblyIcon from "../components/DisplayAssemblyIcon";

const columns = ["Assembly", "Owner", "Solar system"];

const ExploreAssemblies: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    typeId: "0",
    stateId: "0",
  });

  const query = useQuery({
    queryKey: ["Smartassemblies"],
    queryFn: async () =>
      await getSmartassemblies().then((r) =>
        r.data?.filter((sa) => !!sa.typeId)
      ),
  });

  const smartassemblies = React.useMemo(() => {
    if (!query.data) return [];
    const iTypeId = parseInt(search.typeId, 10);
    const iStateId = parseInt(search.stateId, 10);
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["name", "id", "itemId", "ownerName", "ownerId"],
      (sa) => {
        return (
          (sa.typeId === iTypeId || iTypeId === 0) &&
          (sa.stateId === iStateId || iStateId === 0)
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
                <DisplayAssemblyIcon typeId={sa.typeId} stateId={sa.stateId} />
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
            <TableCell>{sa.stateId !== 1 && <Skeleton width={80} />}</TableCell>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={sa.id}>
            <TableCell>
              <Box display="flex" alignItems="center">
                <DisplayAssemblyIcon
                  typeId={sa.typeId}
                  stateId={sa.stateId}
                  tooltip
                />
                <DisplayAssembly name={sa.name} id={sa.id} itemId={sa.itemId} />
              </Box>
            </TableCell>
            <TableCell>
              <DisplayOwner name={sa.ownerName} address={sa.ownerId} />
            </TableCell>
            <TableCell>
              {sa.stateId !== 1 && (
                <DisplaySolarsystem
                  solarSystemId={sa.solarSystem?.solarSystemId}
                />
              )}
            </TableCell>
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
                <MenuItem value="3">Online</MenuItem>
                <MenuItem value="2">Anchored</MenuItem>
                <MenuItem value="1">Unanchored</MenuItem>
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
