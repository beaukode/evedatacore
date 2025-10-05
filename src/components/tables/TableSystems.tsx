import React from "react";
import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import PrivateIcon from "@mui/icons-material/Lock";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ExternalLink from "@/components/ui/ExternalLink";
import {
  getCharacterIdSystems,
  getNamespaceIdSystems,
} from "@/api/evedatacore-v2";
import { useNotify } from "@/tools/useNotify";

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

  return (
    <PaperLevel1 title="Systems" loading={query.isFetching}>
      {!systems && <Typography variant="body1">&nbsp;</Typography>}
      {systems && (
        <>
          {systems && systems.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {systems && systems.length > 0 && (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {!hideNamespaceColumn && <TableCell>Namespace</TableCell>}
                  <TableCell>Contract</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systems.map((sys) => {
                  return (
                    <TableRow key={sys.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ButtonSystem id={sys.id} name={sys.name} />
                          {!sys.publicAccess && privateIcon}
                        </Box>
                      </TableCell>
                      {!hideNamespaceColumn && (
                        <TableCell>
                          <ButtonNamespace
                            id={sys.namespaceId}
                            name={sys.namespace}
                          />
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default TableSystems;
