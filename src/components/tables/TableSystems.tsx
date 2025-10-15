import React from "react";
import { TableCell, Typography, Tooltip, Box } from "@mui/material";
import PrivateIcon from "@mui/icons-material/Lock";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ExternalLink from "@/components/ui/ExternalLink";
import {
  getCharacterIdSystems,
  getNamespaceIdSystems,
  System,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";
import { columnWidths } from "@/constants";
import DataTable, { DataTableColumn } from "../DataTable";

interface TableSystemsProps {
  namespace?: string;
  owner?: string;
  hideNamespaceColumn?: boolean;
  onFetched?: () => void;
}

const TableSystems: React.FC<TableSystemsProps> = ({
  namespace,
  owner,
  hideNamespaceColumn,
  onFetched,
}) => {
  const privateIcon = React.useMemo(
    () => (
      <Tooltip title="Public access is disabled" placement="right" arrow>
        <PrivateIcon color="info" />
      </Tooltip>
    ),
    []
  );

  const queryByNamespace = usePaginatedQuery({
    queryKey: ["Systems", namespace],
    queryFn: async () => {
      if (!namespace) return { items: [] };
      const r = await getNamespaceIdSystems({ path: { id: namespace } });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!namespace,
  });

  const queryByOwner = usePaginatedQuery({
    queryKey: ["Systems", owner],
    queryFn: async () => {
      if (!owner) return { items: [] };
      const r = await getCharacterIdSystems({ path: { id: owner } });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!owner,
  });

  const query = namespace ? queryByNamespace : queryByOwner;

  useNotify(query.isFetched, onFetched);

  const systems = query.data;

  const columns: DataTableColumn<System>[] = React.useMemo(() => {
    const columns: DataTableColumn<System>[] = [
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
        sort: (a, b) => a.namespace?.localeCompare(b.namespace ?? "") ?? 0,
      });
    }

    columns.push({
      label: "Contract",
      width: columnWidths.address,
      sort: (a, b) => a.contract.localeCompare(b.contract),
    });
    return columns;
  }, [hideNamespaceColumn]);

  const itemContent = React.useCallback(
    (_: number, sys: System) => {
      return (
        <React.Fragment key={sys.id}>
          <TableCell>
            <Box display="flex" alignItems="center">
              <ButtonSystem id={sys.id} name={sys.name} />
              {!sys.publicAccess && privateIcon}
            </Box>
          </TableCell>
          {!hideNamespaceColumn && (
            <TableCell>
              <ButtonNamespace id={sys.namespaceId} name={sys.namespace} />
            </TableCell>
          )}
          <TableCell>
            <ExternalLink
              href={`https://explorer.pyropechain.com/address/${sys.contract}`}
              title={sys.contract}
            >
              {sys.contract}
            </ExternalLink>
          </TableCell>
        </React.Fragment>
      );
    },
    [hideNamespaceColumn, privateIcon]
  );

  return (
    <PaperLevel1
      title="Systems"
      loading={query.isFetching}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {!systems && <Typography variant="body1">&nbsp;</Typography>}
      {systems && (
        <>
          {systems.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {systems.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * systems.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={systems}
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

export default TableSystems;
