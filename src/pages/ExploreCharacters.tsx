import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  Avatar,
  TableCell,
  Button,
} from "@mui/material";
import DataTable, { DataTableContext } from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getSmartcharacters } from "../api/stillness";
import { NavLink } from "react-router";
import useQuerySearch from "../tools/useQuerySearch";

const columns = ["Name", "Address"];

const ExploreCharacters: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => await getSmartcharacters().then((r) => r.data),
  });

  const smartcharacters = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.filter(
      (sm) =>
        sm.address !== "0x0000000000000000000000000000000000000000" &&
        (!debouncedSearch.text ||
          sm.name.toLowerCase().includes(debouncedSearch.text) ||
          sm.address.toLowerCase().includes(debouncedSearch.text))
    );
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      sm: (typeof smartcharacters)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={sm.address}>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Avatar
                alt={sm.name}
                sx={{ bgcolor: "black", color: "silver" }}
                src={context.isScrolling ? undefined : sm.image}
                variant="rounded"
              />
              <Button
                component={NavLink}
                to={`/explore/characters/${sm.address}`}
              >
                {sm.name}
              </Button>
            </Box>
          </TableCell>
          <TableCell>{sm.address}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Characters</title>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <TextField
              label="Search"
              value={search.text}
              onChange={(e) =>
                setSearch(
                  "text",
                  e.currentTarget.value.substring(0, 255).toLowerCase()
                )
              }
            />
            <Box>
              <Typography variant="caption" color="textPrimary">
                {smartcharacters.length} characters
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <LinearProgress
              sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
            />
          </Box>
          <DataTable
            data={smartcharacters}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Paper>
      </Box>
    </>
  );
};

export default ExploreCharacters;
