import React from "react";
import { TextField, TableCell, Tooltip, Box } from "@mui/material";
import OffChainIcon from "@mui/icons-material/BackupTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { listTables } from "@/api/mudsql";
import { filterInProps } from "@/tools";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import DisplayOwner from "@/components/DisplayOwner";
import DisplayNamespace from "@/components/DisplayNamespace";
import DisplayTable from "@/components/DisplayTable";
import { DataTableContext } from "@/components/DataTable";
import { NoMaxWidthTooltip } from "@/components/ui/NoMaxWidthTooltip";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";

const columns = ["Name", "Namespace", "Owner", "Fields"];

function buildFieldText(fieldCount: number, keyCount: number) {
  let fieldText = `${fieldCount} field`;
  if (fieldCount > 1) {
    fieldText += "s";
  }
  fieldText += `, ${keyCount} key`;
  if (keyCount > 1) {
    fieldText += "s";
  }
  return fieldText;
}

const ExploreTables: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = useQuery({
    queryKey: ["Tables"],
    queryFn: () => listTables(),
  });

  const tables = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "tableId",
      "name",
      "namespace",
      "namespaceOwnerName",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, t: (typeof tables)[number], context: DataTableContext) => {
      if (context.isScrolling) {
        return (
          <React.Fragment key={t.tableId}>
            <TableCell sx={{ height: 49.5, px: 3 }}>{t.name}</TableCell>
            <TableCell sx={{ height: 49.5, px: 3 }}>{t.namespace}</TableCell>
            <TableCell sx={{ height: 49.5, px: 3 }}>
              {t.namespaceOwnerName || t.namespaceOwner}
            </TableCell>
            <TableCell>
              {buildFieldText(Object.keys(t.schema).length, t.key.length)}
            </TableCell>
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={t.tableId}>
          <TableCell>
            {t.type === "offchainTable" ? (
              <Box display="flex" alignItems="center">
                <DisplayTable id={t.tableId} name={t.name} />
                <Tooltip title="Off-chain table">
                  <OffChainIcon color="secondary" />
                </Tooltip>
              </Box>
            ) : (
              <DisplayTable id={t.tableId} name={t.name} />
            )}
          </TableCell>
          <TableCell>
            <DisplayNamespace id={t.namespaceId} name={t.namespace} />
          </TableCell>
          <TableCell>
            {t.namespaceOwnerName ? (
              <DisplayOwner
                address={t.namespaceOwner}
                name={t.namespaceOwnerName}
              />
            ) : (
              <Box sx={{ px: 1 }}>{t.namespaceOwner}</Box>
            )}
          </TableCell>
          <TableCell>
            <NoMaxWidthTooltip title={<DisplayTableFieldsChips table={t} />}>
              <Box
                sx={{
                  cursor: "help",
                }}
              >
                {buildFieldText(Object.keys(t.schema).length, t.key.length)}
              </Box>
            </NoMaxWidthTooltip>
          </TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
    <DataTableLayout
      title="Tables"
      columns={columns}
      data={tables}
      itemContent={itemContent}
    >
      <TextField
        label="Search"
        value={search.text}
        onChange={(e) => {
          setSearch(
            "text",
            e.currentTarget.value.substring(0, 255).toLowerCase()
          );
        }}
      />
    </DataTableLayout>
  );
};

export default ExploreTables;
