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
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import DataTable, { DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";

const columns = ["Name", "Address", "Id"];

const ExploreCharacters: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
  });

  const smartcharacters = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["address", "name", "id"],
      (sm) => sm.address !== "0x0000000000000000000000000000000000000000"
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
                src={
                  context.isScrolling
                    ? undefined
                    : "https://images.dev.quasar.reitnorf.com/Character/123456789_256.jpg"
                }
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
          <TableCell> {sm.id}</TableCell>
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
