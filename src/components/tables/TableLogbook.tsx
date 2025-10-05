import React from "react";
import {
  TableCell,
  Table,
  TableBody,
  TableRow,
  Typography,
} from "@mui/material";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { getCharacterIdLogbook } from "@/api/evedatacore-v2";

interface TableLogbookProps {
  owner: string;
  enabled: boolean;
  onFetched?: () => void;
}

const TableLogbook: React.FC<TableLogbookProps> = ({ owner, enabled }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
  });

  const query = usePaginatedQuery({
    queryKey: ["LogbookByCharacter", owner],
    queryFn: async ({ pageParam }) => {
      const r = await getCharacterIdLogbook({
        path: { id: owner },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
    enabled: enabled && entry?.isIntersecting,
  });


  const records = query.data;
  return (
    <PaperLevel1 title="Logbook" loading={query.isFetching} sx={{ overflowX: "auto" }}>
      {!records && (
        <Typography variant="body1" ref={ref}>
          &nbsp;
        </Typography>
      )}
      {records && records.length === 0 && (
        <Typography variant="body1">None</Typography>
      )}
      {records && records.length > 0 && (
        <Table size="small">
          <TableBody>
            {records.map((r) => {
              return (
                <TableRow key={r.date}>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {r.date}
                  </TableCell>
                  <TableCell>{r.type}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PaperLevel1>
  );
};

export default TableLogbook;
