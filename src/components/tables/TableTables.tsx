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
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import DisplayNamespace from "@/components/DisplayNamespace";
import DisplayTable from "@/components/DisplayTable";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";

interface TablesProps {
  namespaces: string[];
  hideNamespaceColumn?: boolean;
}

const TableTables: React.FC<TablesProps> = ({
  namespaces,
  hideNamespaceColumn,
}) => {
  const mudSql = useMudSql();

  const queryKey = namespaces.join("|");
  const query = useQuery({
    queryKey: ["Tables", queryKey],
    queryFn: async () => mudSql.listTables({ namespaceIds: namespaces }),
    retry: false,
    throwOnError: true,
  });

  const tables = query.data || [];

  return (
    <PaperLevel1 title="Tables" loading={query.isFetching}>
      {namespaces.length === 0 && <Typography variant="body1">None</Typography>}
      {namespaces.length > 0 && (
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
                        <DisplayTable id={t.tableId} name={t.name} />
                        <Tooltip title="Off-chain table">
                          <OffChainIcon color="secondary" />
                        </Tooltip>
                      </Box>
                    ) : (
                      <DisplayTable id={t.tableId} name={t.name} />
                    )}
                  </TableCell>
                  {!hideNamespaceColumn && (
                    <TableCell>
                      <DisplayNamespace id={t.namespaceId} name={t.namespace} />
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
