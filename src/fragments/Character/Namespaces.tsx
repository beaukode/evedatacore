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
import { listNamespaces } from "@/api/mudsql";
import PaperLevel1 from "@/components/ui/PaperLevel1";

interface NamespacesProps {
  address: string;
}

const Namespaces: React.FC<NamespacesProps> = ({ address }) => {
  const query = useQuery({
    queryKey: ["Namespaces", address],
    queryFn: async () => await listNamespaces({ owners: address }),
  });

  const namespaces = query.data || [];

  return (
    <PaperLevel1 title="Namespaces" loading={query.isFetching} mudChip>
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
                  <TableCell>{ns.name}</TableCell>
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

export default Namespaces;
