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
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import DataTable, { DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { filterInProps, ldapDate } from "@/tools";

const columns = ["Date", "Killer", "Victim", "Loss Type", "Solar System"];

const ExploreKillmails: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Killmails"],
    queryFn: async () => mudSql.listKillmails(),
  });

  const killmails = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "killerName",
      "victimName",
      "killerAddress",
      "victimAddress",
      "killerId",
      "victimId",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, km: (typeof killmails)[number], context: DataTableContext) => {
      const isoDate = ldapDate(km.timestamp).toISOString();
      const date = isoDate.substring(0, 10);
      const time = isoDate.substring(11, 19);
      if (context.isScrolling) {
        return (
          <React.Fragment key={km.id}>
            <TableCell>{`${date} ${time}`}</TableCell>
            <TableCell
              sx={{ height: 49.5, px: 3, py: 1.5, lineHeight: "24.5px" }}
            >
              {km.killerName}
            </TableCell>
            <TableCell
              sx={{ height: 49.5, px: 3, py: 1.5, lineHeight: "24.5px" }}
            >
              {km.victimName}
            </TableCell>
            <TableCell>{km.lossType}</TableCell>
            <TableCell>
              <Skeleton width={80} />
            </TableCell>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={km.id}>
            <TableCell>{`${date} ${time}`}</TableCell>
            <TableCell>
              <ButtonCharacter name={km.killerName} address={km.killerAddress} />
            </TableCell>
            <TableCell>
              <ButtonCharacter name={km.victimName} address={km.victimAddress} />
            </TableCell>
            <TableCell>{km.lossType}</TableCell>
            <TableCell>
              <ButtonSolarsystem solarSystemId={km.solarSystemId} />
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
