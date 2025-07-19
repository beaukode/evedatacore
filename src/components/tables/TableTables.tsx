import React from "react";
import {
  TableCell,
  Tooltip,
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import OffChainIcon from "@mui/icons-material/BackupTable";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonTable from "@/components/buttons/ButtonTable";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import {
  getCharacterIdTables,
  getNamespaceIdTables,
} from "@/api/evedatacore-v2";

interface TablesProps {
  owner?: string;
  namespace?: string;
  hideNamespaceColumn?: boolean;
}

const TableTables: React.FC<TablesProps> = ({
  owner,
  namespace,
  hideNamespaceColumn,
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

  const tables = query.data || [];

  return (
    <PaperLevel1 title="Tables" loading={query.isFetching}>
      {!query.isFetching && tables.length === 0 && (
        <Typography variant="body1">None</Typography>
      )}
      {tables.length > 0 && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {!hideNamespaceColumn && <TableCell>Namespace</TableCell>}
              <TableCell>Fields</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((t) => {
              return (
                <TableRow key={t.tableId}>
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
                  <TableCell>
                    <DisplayTableFieldsChips table={t} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PaperLevel1>
  );
};

export default TableTables;
