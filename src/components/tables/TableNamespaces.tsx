import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import DisplayNamespace from "@/components/DisplayNamespace";

interface NamespacesProps {
  address: string;
}

const TableNamespaces: React.FC<NamespacesProps> = ({ address }) => {
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Namespaces", address],
    queryFn: async () => mudSql.listNamespaces({ owners: address }),
  });

  const namespaces = query.data || [];

  return (
    <PaperLevel1 title="Namespaces" loading={query.isFetching}>
      {namespaces.length === 0 && <Typography variant="body1">None</Typography>}
      {namespaces.length > 0 && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {namespaces.map((ns) => {
              return (
                <TableRow key={ns.namespaceId}>
                  <TableCell>
                    <DisplayNamespace id={ns.namespaceId} name={ns.name} />
                  </TableCell>
                  <TableCell>{ns.namespaceId}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PaperLevel1>
  );
};

export default TableNamespaces;
