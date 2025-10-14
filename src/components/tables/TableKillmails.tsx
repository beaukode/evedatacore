import React from "react";
import { TableCell, Typography, Box } from "@mui/material";
import { tsToDateTime } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import {
  getCharacterIdKills,
  getSolarsystemIdKills,
  Kill,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";
import DataTable, { DataTableColumn } from "../DataTable";
import { columnWidths } from "@/constants";

interface TableKillmailsProps {
  characterId?: string;
  solarSystemId?: string;
  onFetched?: () => void;
}

const TableKillmails: React.FC<TableKillmailsProps> = ({
  characterId,
  solarSystemId,
  onFetched,
}) => {
  const queryByCharacter = usePaginatedQuery({
    queryKey: ["KillsByCharacter", characterId],
    queryFn: async ({ pageParam }) => {
      if (!characterId) return { items: [] };
      const r = await getCharacterIdKills({
        path: { id: characterId },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!characterId,
  });

  const queryBySolarSystem = usePaginatedQuery({
    queryKey: ["KillsBySolarSystem", solarSystemId],
    queryFn: async ({ pageParam }) => {
      if (!solarSystemId) return { items: [] };
      const r = await getSolarsystemIdKills({
        path: { id: Number(solarSystemId) },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!solarSystemId,
  });

  const columns: DataTableColumn<Kill>[] = React.useMemo(() => {
    const columns: DataTableColumn<Kill>[] = [
      {
        label: "Date",
        width: columnWidths.datetime,
        sort: (a, b) => (a.killedAt ?? 0) - (b.killedAt ?? 0),
        initialSort: "desc",
      },
      {
        label: "Killer",
        width: columnWidths.common,
        sort: (a, b) => a.killerName?.localeCompare(b.killerName ?? "") ?? 0,
      },
      {
        label: "Victim",
        width: columnWidths.common,
        sort: (a, b) => a.victimName?.localeCompare(b.victimName ?? "") ?? 0,
      },
      {
        label: "Loss Type",
        width: columnWidths.solarSystem,
      },
    ];
    if (!solarSystemId) {
      columns.push({
        label: "Solar System",
        width: columnWidths.solarSystem,
      });
    }
    return columns;
  }, [solarSystemId]);

  const itemContent = React.useCallback(
    (_: number, km: Kill) => {
      return (
        <React.Fragment key={km.id}>
          <TableCell>{tsToDateTime(km.killedAt)}</TableCell>
          <TableCell>
            <ButtonCharacter name={km.killerName} address={km.killerAccount} />
          </TableCell>
          <TableCell>
            <ButtonCharacter name={km.victimName} address={km.victimAccount} />
          </TableCell>
          <TableCell>{km.lossType === 0 ? "Ship" : "(Unknown)"}</TableCell>
          {!solarSystemId && (
            <TableCell>
              <ButtonSolarsystem solarSystemId={km.solarSystemId} />
            </TableCell>
          )}
        </React.Fragment>
      );
    },
    [solarSystemId]
  );

  const query = characterId ? queryByCharacter : queryBySolarSystem;
  const kills = query.data;

  useNotify(query.isFetched, onFetched);

  return (
    <PaperLevel1
      title="Killmails"
      loading={query.isFetching || !query.isEnabled}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {!kills && <Typography variant="body1">&nbsp;</Typography>}
      {kills && (
        <>
          {kills.length === 0 && <Typography variant="body1">None</Typography>}
          {kills.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * kills.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={kills}
                columns={columns}
                itemContent={itemContent}
              />
            </Box>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default TableKillmails;
