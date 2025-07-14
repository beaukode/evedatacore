import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { getCharacterIdNamespaces } from "@/api/evedatacore-v2";

interface NamespacesProps {
  owner: string;
}

const TableNamespaces: React.FC<NamespacesProps> = ({ owner }) => {
  const query = usePaginatedQuery({
    queryKey: ["Namespaces", owner],
    queryFn: async ({ pageParam }) => {
      const r = await getCharacterIdNamespaces({
        path: { id: owner ?? "" },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
  });

  const namespaces = query.data || [];

  return (
    <PaperLevel1 title="Namespaces" loading={query.isFetching}>
      {!query.isFetching && namespaces.length === 0 && (
        <Typography variant="body1">None</Typography>
      )}
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
                <TableRow key={ns.id}>
                  <TableCell>
                    <ButtonNamespace id={ns.id} name={ns.name} />
                  </TableCell>
                  <TableCell>{ns.id}</TableCell>
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
