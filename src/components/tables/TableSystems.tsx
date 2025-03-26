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
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "../buttons/ButtonSystem";
import ExternalLink from "../ui/ExternalLink";

interface TableSystemsProps {
  namespaces: string[];
  hideNamespaceColumn?: boolean;
}

const TableSystems: React.FC<TableSystemsProps> = ({
  namespaces,
  hideNamespaceColumn,
}) => {
  const mudSql = useMudSql();

  const queryKey = namespaces.join("|");
  const query = useQuery({
    queryKey: ["Systems", queryKey],
    queryFn: async () => mudSql.listSystems({ namespaceIds: namespaces }),
  });

  const privateIcon = React.useMemo(
    () => (
      <Tooltip title="Public access is disabled" placement="right" arrow>
        <PrivateIcon color="info" />
      </Tooltip>
    ),
    []
  );

  const systems = query.data || [];

  return (
    <PaperLevel1 title="Systems" loading={query.isFetching}>
      {namespaces.length === 0 && <Typography variant="body1">None</Typography>}
      {namespaces.length > 0 && (
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
                <TableRow key={sys.systemId}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ButtonSystem id={sys.systemId} name={sys.name} />
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
    </PaperLevel1>
  );
};

export default TableSystems;
