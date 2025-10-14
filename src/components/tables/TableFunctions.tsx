import React from "react";
import { TableCell, Typography, Box } from "@mui/material";
import { isHex } from "viem";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonGeneric from "@/components/buttons/ButtonGeneric";
import {
  getNamespaceIdFunctions,
  getCharacterIdFunctions,
  Function,
} from "@/api/evedatacore-v2";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { useNotify } from "@/tools/useNotify";
import DataTable, { DataTableColumn } from "../DataTable";
import { columnWidths } from "@/constants";

interface TableFunctionsProps {
  namespace?: string;
  system?: string;
  owner?: string;
  hideColumns: Array<"namespace" | "owner" | "system">;
  onFetched?: () => void;
}

const TableFunctions: React.FC<TableFunctionsProps> = ({
  namespace,
  system,
  owner,
  hideColumns,
  onFetched,
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
  useNotify(query.isFetched, onFetched);

  const functions = query.data;

  const columns: DataTableColumn<Function>[] = React.useMemo(() => {
    const columns: DataTableColumn<Function>[] = [
      {
        label: "Signature",
        width: columnWidths.common,
        grow: true,
        sort: (a, b) => a.signature.localeCompare(b.signature),
        initialSort: "asc",
      },
      {
        label: "Selectors (world/system)",
        width: columnWidths.common,
        sort: (a, b) => a.id.localeCompare(b.id),
      },
    ];
    if (!hideColumns.includes("namespace")) {
      columns.push({
        label: "Namespace",
        width: columnWidths.common,
        sort: (a, b) => a.namespace?.localeCompare(b.namespace ?? "") ?? 0,
      });
    }
    if (!hideColumns.includes("owner")) {
      columns.push({
        label: "Owner",
        width: columnWidths.common,
        sort: (a, b) => a.ownerName?.localeCompare(b.ownerName ?? "") ?? 0,
      });
    }
    if (!hideColumns.includes("system")) {
      columns.push({
        label: "System",
        width: columnWidths.common,
        sort: (a, b) => a.systemName?.localeCompare(b.systemName ?? "") ?? 0,
      });
    }
    return columns;
  }, [hideColumns]);

  const itemContent = React.useCallback(
    (_: number, fn: Function) => {
      return (
        <React.Fragment key={fn.id}>
          <TableCell colSpan={2}>
            <ButtonGeneric to={`/explore/functions/${fn.id}`}>
              {fn.signature}
            </ButtonGeneric>
          </TableCell>
          <TableCell>
            {fn.id} / {fn.systemSelector}
          </TableCell>
          {!hideColumns.includes("namespace") && (
            <TableCell>
              <ButtonNamespace id={fn.namespaceId} name={fn.namespace} />
            </TableCell>
          )}
          {!hideColumns.includes("owner") && (
            <TableCell>
              {fn.account && (
                <>
                  {fn.ownerName && (
                    <ButtonCharacter address={fn.account} name={fn.ownerName} />
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
        </React.Fragment>
      );
    },
    [hideColumns]
  );

  return (
    <PaperLevel1
      title="Functions"
      loading={query.isFetching}
      sx={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {!functions && <Typography variant="body1">&nbsp;</Typography>}
      {functions && (
        <>
          {functions.length === 0 && (
            <Typography variant="body1">None</Typography>
          )}
          {functions.length > 0 && (
            <Box
              flexGrow={1}
              flexBasis={100}
              height="100%"
              minHeight={`min(50vh, ${37 + 50 * functions.length}px)`}
              overflow="hidden"
            >
              <DataTable
                data={functions}
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

export default TableFunctions;
