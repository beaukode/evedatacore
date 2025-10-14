import React from "react";
import {
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  TableSortLabel,
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

type ColumnAttributes<T extends Record<string, unknown>> = {
  label: React.ReactNode;
  sort?: (a: T, b: T) => number;
  initialSort?: "asc" | "desc";
  sx?: React.ComponentProps<typeof TableCell>["sx"];
  width?: number;
  grow?: boolean;
};

export type DataTableColumn<
  T extends Record<string, unknown> = Record<string, unknown>,
> = ColumnAttributes<T>;

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataTableColumn<T>[];
  itemContent: DataTableItemContentCallback<T>;
  rememberScroll?: boolean;
  dynamicWidth?: boolean;
}

type Sort = { index: number | undefined; direction: "asc" | "desc" };

function getInitialSortBy<T extends Record<string, unknown>>(
  columns: DataTableColumn<T>[]
): Sort {
  for (let i = 0; i < columns.length; i++) {
    if (columns[i]?.initialSort) {
      return { index: i, direction: columns[i]!.initialSort! };
    }
  }
  return { index: undefined, direction: "asc" };
}

const DataTable = <
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  data,
  itemContent,
  columns: rawColumns,
  rememberScroll,
  dynamicWidth,
}: DataTableProps<T>) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scroll, setScroll] = React.useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = React.useState<Sort>(() =>
    getInitialSortBy(rawColumns)
  );
  const initialSortBy = React.useRef(getInitialSortBy(rawColumns));

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

  const columns: ColumnAttributes<T>[] = React.useMemo(() => {
    return rawColumns.map((v) => {
      if (typeof v === "string") {
        return { label: v };
      }
      return v;
    });
  }, [rawColumns]);

  const sortedData = React.useMemo(() => {
    const { index, direction } = sortBy;
    // If the sort is the same as the initial sort, return the data as is
    if (
      index === undefined ||
      (index === initialSortBy.current.index &&
        direction === initialSortBy.current.direction)
    ) {
      return data;
    }
    // Copy the data to avoid mutating the original data
    return [...data].sort((a, b) => {
      if (columns[index]) {
        const r = columns[index].sort?.(a, b) ?? 0;
        return direction === "asc" ? r : -r;
      }
      return 0;
    });
  }, [data, sortBy, columns]);

  function createSortHandler(newIndex: number) {
    return () => {
      setSortBy(({ index, direction }) => {
        if (index === newIndex) {
          return {
            index,
            direction: direction === "asc" ? "desc" : "asc",
          };
        }
        return {
          index: newIndex,
          direction: "asc",
        };
      });
    };
  }

  return (
    <>
      <TableVirtuoso
        data={sortedData}
        context={{ isScrolling }}
        isScrolling={setIsScrolling}
        rangeChanged={(range) =>
          rememberScroll ? setScroll(range.startIndex) : undefined
        }
        initialTopMostItemIndex={initialScrollTo || 0}
        fixedHeaderContent={() => (
          <TableRow>
            {columns.map(({ label, grow, sx, sort }, i) =>
              grow ? (
                <TableCell colSpan={2} key={i} sx={sx}>
                  {sort ? (
                    <TableSortLabel
                      active={sortBy.index === i}
                      direction={sortBy.direction}
                      onClick={createSortHandler(i)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    <>{label}</>
                  )}
                </TableCell>
              ) : (
                <TableCell key={i} sx={sx}>
                  {sort ? (
                    <TableSortLabel
                      active={sortBy.index === i}
                      direction={sortBy.direction}
                      onClick={createSortHandler(i)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    <>{label}</>
                  )}
                </TableCell>
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
