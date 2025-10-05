import React from "react";
import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { tsToDateTime } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import {
  getCharacterIdKills,
  getSolarsystemIdKills,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";

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

  const query = characterId ? queryByCharacter : queryBySolarSystem;

  useNotify(query.isFetched, onFetched);

  return (
    <PaperLevel1
      title="Killmails"
      loading={query.isFetching || !query.isEnabled}
    >
      {!query.data && <Typography variant="body1">&nbsp;</Typography>}
      {query.data && (
        <>
          {query.data.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {query.data.length > 0 && (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Killer</TableCell>
                  <TableCell>Victim</TableCell>
                  <TableCell>Loss Type</TableCell>
                  {!solarSystemId && <TableCell>Solar System</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data.map((km) => {
                  return (
                    <TableRow key={km.id}>
                      <TableCell>{tsToDateTime(km.killedAt)}</TableCell>
                      <TableCell>
                        <ButtonCharacter
                          name={km.killerName}
                          address={km.killerAccount}
                        />
                      </TableCell>
                      <TableCell>
                        <ButtonCharacter
                          name={km.victimName}
                          address={km.victimAccount}
                        />
                      </TableCell>
                      <TableCell>
                        {km.lossType === 0 ? "Ship" : "(Unknown)"}
                      </TableCell>
                      {!solarSystemId && (
                        <TableCell>
                          <ButtonSolarsystem solarSystemId={km.solarSystemId} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default TableKillmails;
