import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  TableCell,
  Skeleton,
} from "@mui/material";
import DataTable, { DataTableContext } from "../components/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getKillmails } from "../api/stillness";
import useQuerySearch from "../tools/useQuerySearch";
import DisplaySolarsystem from "../components/DisplaySolarsystem";
import DisplayOwner from "../components/DisplayOwner";
import { ldapDate } from "../tools";

const columns = ["Date", "Killer", "Victim", "Loss Type", "Solar System"];

const ExploreKillmails: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = useQuery({
    queryKey: ["Killmails"],
    queryFn: async () =>
      await getKillmails().then((r) =>
        r.data?.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      ),
  });

  const killmails = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((km) => {
      return (
        km.killer?.name?.toLowerCase().includes(debouncedSearch.text) ||
        km.victim?.name?.toLowerCase().includes(debouncedSearch.text) ||
        km.killer?.address?.toLowerCase().includes(debouncedSearch.text) ||
        km.victim?.address?.toLowerCase().includes(debouncedSearch.text)
      );
    });
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, km: (typeof killmails)[number], context: DataTableContext) => {
      const key = `${km.killer?.address}-${km.victim?.address}-${km.timestamp}`;
      const isoDate = ldapDate(km.timestamp).toISOString();
      const date = isoDate.substring(0, 10);
      const time = isoDate.substring(11, 19);
      if (context.isScrolling) {
        return (
          <React.Fragment key={key}>
            <TableCell>{`${date} ${time}`}</TableCell>
            <TableCell
              sx={{ height: 49.5, px: 3, py: 1.5, lineHeight: "24.5px" }}
            >
              {km.killer?.name}
            </TableCell>
            <TableCell
              sx={{ height: 49.5, px: 3, py: 1.5, lineHeight: "24.5px" }}
            >
              {km.victim?.name}
            </TableCell>
            <TableCell>{km.loss_type}</TableCell>
            <TableCell>
              <Skeleton width={80} />
            </TableCell>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={key}>
            <TableCell>{`${date} ${time}`}</TableCell>
            <TableCell>
              <DisplayOwner
                name={km.killer?.name}
                address={km.killer?.address}
              />
            </TableCell>
            <TableCell>
              <DisplayOwner
                name={km.victim?.name}
                address={km.victim?.address}
              />
            </TableCell>
            <TableCell>{km.loss_type}</TableCell>
            <TableCell>
              <DisplaySolarsystem solarSystemId={km.solar_system_id} />
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
        <title>Killmails</title>
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
                {killmails.length} Killmails
              </Typography>
            </Box>
          </Box>
          <Box mt={2}>
            <LinearProgress
              sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
            />
          </Box>
          <DataTable
            data={killmails}
            columns={columns}
            itemContent={itemContent}
            rememberScroll
          />
        </Paper>
      </Box>
    </>
  );
};

export default ExploreKillmails;
