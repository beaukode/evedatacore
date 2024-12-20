import React from "react";
import {
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import { ListRange as VirtuosoListRange, TableVirtuoso } from "react-virtuoso";
import { useLocation, useNavigate } from "react-router";
import { useDebounce } from "@uidotdev/usehooks";

export type DataTableContext = { isScrolling: boolean };

export type ListRange = VirtuosoListRange;

export type DataTableItemContentCallback<T extends Record<string, unknown>> = (
  index: number,
  item: T,
  context: DataTableContext
) => React.ReactNode;

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: string[];
  itemContent: DataTableItemContentCallback<T>;
  rememberScroll?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
  data,
  itemContent,
  columns,
  rememberScroll,
}: DataTableProps<T>) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scroll, setScroll] = React.useState<number | undefined>(undefined);

  const location = useLocation();
  const navigate = useNavigate();

  const initialScrollTo = rememberScroll
    ? Number.parseInt(location.hash.substring(1), 10) || 0
    : 0;

  const debounceScroll = useDebounce(scroll, 300);

  React.useEffect(() => {
    if (debounceScroll !== undefined) {
      navigate(
        { hash: `${debounceScroll || ""}`, search: location.search },
        { replace: true }
      );
    }
  }, [debounceScroll, location.search, navigate]);

  return (
    <>
      <TableVirtuoso
        data={data}
        context={{ isScrolling }}
        isScrolling={setIsScrolling}
        rangeChanged={(range) =>
          rememberScroll ? setScroll(range.startIndex) : undefined
        }
        initialTopMostItemIndex={initialScrollTo || 0}
        fixedHeaderContent={() => (
          <TableRow>
            {columns.map((c, i) => (
              <TableCell key={i}>{c}</TableCell>
            ))}
          </TableRow>
        )}
        components={{
          Table: (props) => (
            <Table
              size="small"
              {...props}
              sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
              stickyHeader
            />
          ),
          TableHead: React.forwardRef((props, ref) => (
            <TableHead {...props} ref={ref} />
          )),
          TableRow,
          TableBody: React.forwardRef((props, ref) => (
            <TableBody {...props} ref={ref} />
          )),
        }}
        itemContent={itemContent}
      />
    </>
  );
};

const MemoizedDataTable = React.memo(DataTable) as typeof DataTable;
export default MemoizedDataTable;
