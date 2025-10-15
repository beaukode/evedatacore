import React from "react";
import { Typography, TableCell, Box } from "@mui/material";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { getCharacterIdNamespaces, Namespace } from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";
import { columnWidths } from "@/constants";
import DataTable, { DataTableColumn } from "../DataTable";

interface NamespacesProps {
  owner: string;
  onFetched?: () => void;
}

const columns: DataTableColumn<Namespace>[] = [
  {
    label: "Name",
    width: columnWidths.common,
    grow: true,
    sort: (a, b) => a.name.localeCompare(b.name),
    initialSort: "asc",
  },
  {
    label: "Id",
    width: 600,
  },
];

const TableNamespaces: React.FC<NamespacesProps> = ({ owner, onFetched }) => {
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

  useNotify(query.isFetched, onFetched);

  const namespaces = query.data;

  const itemContent = React.useCallback((_: number, ns: Namespace) => {
    return (
      <React.Fragment key={ns.id}>
        <TableCell colSpan={2}>
          <ButtonNamespace id={ns.id} name={ns.name} />
        </TableCell>
        <TableCell>{ns.id}</TableCell>
      </React.Fragment>
    );
  }, []);

  return (
    <PaperLevel1
      title="Namespaces"
      loading={query.isFetching}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {!namespaces && <Typography variant="body1">&nbsp;</Typography>}
      {namespaces && (
        <>
          {namespaces.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {namespaces.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * namespaces.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={namespaces}
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

export default TableNamespaces;
