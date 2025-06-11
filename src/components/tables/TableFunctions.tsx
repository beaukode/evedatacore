import React from "react";
import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "../buttons/ButtonSystem";
import ButtonCharacter from "../buttons/ButtonCharacter";
import ButtonGeneric from "../buttons/ButtonGeneric";

interface TableFunctionsProps {
  namespaces?: string[];
  systems?: string[];
  hideColumns: Array<"namespace" | "owner" | "system">;
}

const TableFunctions: React.FC<TableFunctionsProps> = ({
  namespaces,
  systems,
  hideColumns,
}) => {
  const mudSql = useMudSql();

  const queryByNamespaces = useQuery({
    queryKey: ["Functions", (namespaces || []).join("|")],
    queryFn: async () => mudSql.listFunctions({ namespaceIds: namespaces }),
    enabled: !!namespaces,
  });

  const queryBySystems = useQuery({
    queryKey: ["Functions", (systems || []).join("|")],
    queryFn: async () => mudSql.listFunctions({ systemsIds: systems }),
    enabled: !!systems,
  });

  const query = namespaces ? queryByNamespaces : queryBySystems;
  const functions = query.data || [];

  return (
    <PaperLevel1
      title="Functions"
      loading={query.isFetching}
      sx={{ overflowX: "auto" }}
    >
      {functions.length === 0 && <Typography variant="body1">None</Typography>}
      {functions.length > 0 && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Signature</TableCell>
              <TableCell>Selectors (world/system)</TableCell>
              {!hideColumns.includes("namespace") && (
                <TableCell width={180}>Namespace</TableCell>
              )}
              {!hideColumns.includes("owner") && (
                <TableCell width={250}>Owner</TableCell>
              )}
              {!hideColumns.includes("system") && (
                <TableCell width={250}>System</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {functions.map((fn) => {
              return (
                <TableRow key={fn.worldSelector}>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    <ButtonGeneric
                      to={`/explore/functions/${fn.worldSelector}`}
                    >
                      {fn.signature}
                    </ButtonGeneric>
                  </TableCell>
                  <TableCell>
                    {fn.worldSelector} / {fn.systemSelector}
                  </TableCell>
                  {!hideColumns.includes("namespace") && (
                    <TableCell>
                      {fn.namespaceId && fn.namespace && (
                        <ButtonNamespace
                          id={fn.namespaceId}
                          name={fn.namespace}
                        />
                      )}
                    </TableCell>
                  )}
                  {!hideColumns.includes("owner") && (
                    <TableCell>
                      {fn.namespaceOwner && (
                        <>
                          {fn.namespaceOwnerName && (
                            <ButtonCharacter
                              address={fn.namespaceOwner}
                              name={fn.namespaceOwnerName}
                            />
                          )}
                          {!fn.namespaceOwnerName && (
                            <Box component="span" sx={{ px: 1 }}>
                              {fn.namespaceOwner}
                            </Box>
                          )}
                        </>
                      )}
                    </TableCell>
                  )}
                  {!hideColumns.includes("system") && (
                    <TableCell>
                      {fn.systemId && fn.systemName && (
                        <ButtonSystem id={fn.systemId} name={fn.systemName} />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </PaperLevel1>
  );
};

export default TableFunctions;
