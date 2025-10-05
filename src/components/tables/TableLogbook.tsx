import React from "react";
import { TableCell, Typography } from "@mui/material";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { getCharacterIdLogbook, LogBookRecord } from "@/api/evedatacore-v2";
import DataTable, { DataTableColumn } from "../DataTable";
import { columnWidths } from "@/constants";
import { logbookComponents } from "../logbook";

interface TableLogbookProps {
  owner: string;
  enabled: boolean;
  onFetched?: () => void;
}

function formatDate(date: string) {
  const [datePart] = date.split("|");
  if (!datePart) return "";
  const isoDate = new Date(datePart).toISOString();
  return isoDate.substring(0, 10) + " " + isoDate.substring(11, 19);
}

function renderLog(log: LogBookRecord) {
  const Component =
    logbookComponents[log.type as keyof typeof logbookComponents];
  if (!Component) return <div>{log.type}</div>;
  return <Component log={log} />;
}

const columns: DataTableColumn[] = [
  { label: "Date", width: columnWidths.datetime },
  { label: "Log", width: columnWidths.common, grow: true },
];

const TableLogbook: React.FC<TableLogbookProps> = ({ owner, enabled }) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: "0px",
  });

  const query = usePaginatedQuery({
    queryKey: ["LogbookByCharacter", owner],
    queryFn: async ({ pageParam }) => {
      console.log("isIntersecting query");
      const r = await getCharacterIdLogbook({
        path: { id: owner },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
    enabled: Boolean(enabled && entry?.isIntersecting),
  });

  const records = query.data;

  const itemContent = React.useCallback(
    (_: number, r: NonNullable<typeof records>[number]) => {
      return (
        <React.Fragment key={r.id}>
          <TableCell>{formatDate(r.date)}</TableCell>
          <TableCell colSpan={2}>{renderLog(r)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
    <PaperLevel1
      title="Logbook"
      loading={query.isFetching}
      sx={{ overflowX: "auto" }}
    >
      {!records && (
        <Typography variant="body1" ref={ref}>
          &nbsp;
        </Typography>
      )}
      {records && (
        <>
          {records.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {records.length > 0 && (
            <div style={{ height: "50vh" }}>
              <DataTable
                data={records}
                columns={columns}
                itemContent={itemContent}
              />
            </div>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default TableLogbook;
