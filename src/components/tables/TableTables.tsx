import React from "react";
import { TableCell, Tooltip, Box, Typography } from "@mui/material";
import OffChainIcon from "@mui/icons-material/BackupTable";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonTable from "@/components/buttons/ButtonTable";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import {
  getCharacterIdTables,
  getNamespaceIdTables,
  Table,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";
import DataTable, { DataTableColumn } from "../DataTable";
import { columnWidths } from "@/constants";

interface TablesProps {
  owner?: string;
  namespace?: string;
  hideNamespaceColumn?: boolean;
  onFetched?: () => void;
}

const TableTables: React.FC<TablesProps> = ({
  owner,
  namespace,
  hideNamespaceColumn,
  onFetched,
}) => {
  const queryKey: string[] = ["Tables"];
  if (owner) queryKey.push(`owner:${owner}`);
  if (namespace) queryKey.push(`namespace:${namespace}`);

  const query = usePaginatedQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const r = await (owner ? getCharacterIdTables : getNamespaceIdTables)({
        path: { id: owner ?? namespace ?? "" },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  useNotify(query.isFetched, onFetched);

  const tables = query.data;

  const columns: DataTableColumn<Table>[] = React.useMemo(() => {
    const columns: DataTableColumn<Table>[] = [
      {
        label: "Name",
        width: columnWidths.common,
        sort: (a, b) => a.name.localeCompare(b.name),
        initialSort: "asc",
      },
    ];

    if (!hideNamespaceColumn) {
      columns.push({
        label: "Namespace",
        width: columnWidths.common,
        sort: (a, b) => a.namespace.localeCompare(b.namespace),
      });
    }

    columns.push({
      label: "Fields",
      grow: true,
      width: columnWidths.common,
    });
    return columns;
  }, [hideNamespaceColumn]);

  const itemContent = React.useCallback(
    (_: number, t: Table) => {
      return (
        <React.Fragment key={t.tableId}>
          <TableCell>
            {t.type === "offchainTable" ? (
              <Box display="flex" alignItems="center">
                <ButtonTable id={t.tableId} name={t.name} />
                <Tooltip title="Off-chain table">
                  <OffChainIcon color="secondary" />
                </Tooltip>
              </Box>
            ) : (
              <ButtonTable id={t.tableId} name={t.name} />
            )}
          </TableCell>
          {!hideNamespaceColumn && (
            <TableCell>
              <ButtonNamespace id={t.namespaceId} name={t.namespace} />
            </TableCell>
          )}
          <TableCell colSpan={2}>
            <DisplayTableFieldsChips table={t} />
          </TableCell>
        </React.Fragment>
      );
    },
    [hideNamespaceColumn]
  );

  return (
    <PaperLevel1
      title="Tables"
      loading={query.isFetching}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {!tables && <Typography variant="body1">&nbsp;</Typography>}
      {tables && (
        <>
          {tables.length === 0 && <Typography variant="body1">None</Typography>}
          {tables.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * tables.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={tables}
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

export default TableTables;
