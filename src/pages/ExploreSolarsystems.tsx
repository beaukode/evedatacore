import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  TextField,
  Typography,
  TableCell,
  Button,
} from "@mui/material";
import DataTable from "../components/DataTable";
import useQuerySearch from "../tools/useQuerySearch";
import { useSolarSystemsIndex } from "../contexts/AppContext";
import { NavLink } from "react-router";

const columns = ["Name", "Id"];

const ExploreSolarsystems: React.FC = () => {
  const ssIndex = useSolarSystemsIndex();

  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const solarsystems = React.useMemo(() => {
    const ss = ssIndex.getById(debouncedSearch.text);
    if (ss) {
      return [ss];
    }
    return ssIndex.searchByName(debouncedSearch.text);
  }, [debouncedSearch.text, ssIndex]);

  const itemContent = React.useCallback(
    (_: number, ss: (typeof solarsystems)[number]) => {
      return (
        <React.Fragment key={ss.solarSystemId}>
          <TableCell>
            <Button
              component={NavLink}
              to={`/solarsystems/${ss.solarSystemId}`}
            >
              {ss.solarSystemName}
            </Button>
          </TableCell>
          <TableCell>{ss.solarSystemId}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Solar systems</title>
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
              label="Search"
              value={search.text}
              onChange={(e) => {
                setSearch(
                  "text",
                  e.currentTarget.value.substring(0, 255).toLowerCase()
                );
              }}
            />

            <Box flexGrow={1} textAlign="right">
              <Typography variant="caption" color="textPrimary">
                {solarsystems.length} solar systems
              </Typography>
            </Box>
          </Box>
          <DataTable
            data={solarsystems}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Paper>
      </Box>
    </>
  );
};

export default ExploreSolarsystems;
