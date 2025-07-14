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
import { isHex } from "viem";
import { usePaginatedQuery } from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonGeneric from "@/components/buttons/ButtonGeneric";
import {
  getNamespaceIdFunctions,
  getCharacterIdFunctions,
} from "@/api/evedatacore-v2";
import { hexToResource, resourceToHex } from "@latticexyz/common";

interface TableFunctionsProps {
  namespace?: string;
  system?: string;
  owner?: string;
  hideColumns: Array<"namespace" | "owner" | "system">;
}

const TableFunctions: React.FC<TableFunctionsProps> = ({
  namespace,
  system,
  owner,
  hideColumns,
}) => {
  const queryByNamespace = usePaginatedQuery({
    queryKey: ["Functions", namespace, system],
    queryFn: async () => {
      if (system && isHex(system)) {
        const resource = hexToResource(system);
        namespace = resourceToHex({
          type: "namespace",
          namespace: resource.namespace,
          name: "",
        });
      }
      if (!namespace) return { items: [] };
      const r = await getNamespaceIdFunctions({ path: { id: namespace } });
      if (!r.data) return { items: [] };
      if (system) {
        r.data.items = r.data.items.filter((f) => f.systemId === system);
      }
      return r.data;
    },
    enabled: !!(system || namespace),
  });

  const queryByOwner = usePaginatedQuery({
    queryKey: ["Functions", owner],
    queryFn: async () => {
      if (!owner) return { items: [] };
      const r = await getCharacterIdFunctions({ path: { id: owner } });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!owner,
  });

  const query = system || namespace ? queryByNamespace : queryByOwner;
  const functions = query.data;

  return (
    <PaperLevel1
      title="Functions"
      loading={query.isFetching}
      sx={{ overflowX: "auto" }}
    >
      {functions && functions.length === 0 && (
        <Typography variant="body1">None</Typography>
      )}
      {functions && functions.length > 0 && (
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
                <TableRow key={fn.id}>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    <ButtonGeneric to={`/explore/functions/${fn.id}`}>
                      {fn.signature}
                    </ButtonGeneric>
                  </TableCell>
                  <TableCell>
                    {fn.id} / {fn.systemSelector}
                  </TableCell>
                  {!hideColumns.includes("namespace") && (
                    <TableCell>
                      <ButtonNamespace
                        id={fn.namespaceId}
                        name={fn.namespace}
                      />
                    </TableCell>
                  )}
                  {!hideColumns.includes("owner") && (
                    <TableCell>
                      {fn.account && (
                        <>
                          {fn.ownerName && (
                            <ButtonCharacter
                              address={fn.account}
                              name={fn.ownerName}
                            />
                          )}
                          {!fn.ownerName && (
                            <Box component="span" sx={{ px: 1 }}>
                              {fn.account}
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
