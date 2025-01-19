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

type ColumnAttributes = {
  label: string;
  width?: number;
  grow?: boolean;
};

export type DataTableColumn = ColumnAttributes;

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataTableColumn[];
  itemContent: DataTableItemContentCallback<T>;
  rememberScroll?: boolean;
  dynamicWidth?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
  data,
  itemContent,
  columns: rawColumns,
  rememberScroll,
  dynamicWidth,
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

  const sx = dynamicWidth
    ? ({
        borderCollapse: "separate",
        tableLayout: "fixed",
        width: "auto",
        minWidth: "100%",
      } as const)
    : ({
        borderCollapse: "separate",
        tableLayout: "fixed",
        width: "100%",
      } as const);

  const columns: ColumnAttributes[] = React.useMemo(() => {
    return rawColumns.map((v) => {
      if (typeof v === "string") {
        return { label: v };
      }
      return v;
    });
  }, [rawColumns]);

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
            {columns.map(({ label, grow }, i) =>
              grow ? (
                <TableCell colSpan={2} key={i}>
                  {label}
                </TableCell>
              ) : (
                <TableCell key={i}>{label}</TableCell>
              )
            )}
          </TableRow>
        )}
        components={{
          Table: ({ children, ...props }) => (
            <Table size="small" {...props} sx={sx} stickyHeader>
              <colgroup>
                {columns.map(({ width, grow }, i) =>
                  grow ? (
                    <React.Fragment key={i}>
                      <col style={{ width }} />
                      <col />
                    </React.Fragment>
                  ) : (
                    <col key={i} style={{ width }} />
                  )
                )}
              </colgroup>
              {children}
            </Table>
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
