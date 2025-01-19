import React from "react";
import {
  TextField,
  TableCell,
  Tooltip,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import OffChainIcon from "@mui/icons-material/BackupTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { filterInProps } from "@/tools";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonTable from "@/components/buttons/ButtonTable";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import { NoMaxWidthTooltip } from "@/components/ui/NoMaxWidthTooltip";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import DisplayTableContent from "@/components/DisplayTableContent";
import ExternalLink from "@/components/ui/ExternalLink";
import { columnWidths } from "@/constants";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Namespace", width: columnWidths.common },
  { label: "Owner", width: columnWidths.address },
  { label: "Fields", width: 200 },
];

const ExploreTables: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    owner: "0",
    namespace: "0",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Tables"],
    queryFn: () => mudSql.listTables(),
  });

  const tables = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      ["tableId", "name", "namespace", "namespaceOwnerName"],
      (table) =>
        (search.owner === "0" || table.namespaceOwner === search.owner) &&
        (search.namespace === "0" || table.namespaceId === search.namespace)
    );
  }, [query.data, search.owner, search.namespace, debouncedSearch.text]);

  const owners = React.useMemo(() => {
    if (!query.data) return;
    const owners = query.data.reduce(
      (acc, t) => {
        const namespaceOwner = t.namespaceOwner || "0x";
        if (!acc[namespaceOwner]) {
          acc[namespaceOwner] = t.namespaceOwnerName || namespaceOwner;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const sorted = Object.entries(owners).sort(
      ([, a]: [string, string], [, b]: [string, string]) => {
        // Put unknwon owners at the end
        if (a.startsWith("0x") && !b.startsWith("0x")) {
          return 1;
        } else if (!a.startsWith("0x") && b.startsWith("0x")) {
          return -1;
        } else {
          return a.localeCompare(b);
        }
      }
    );

    return new Map(sorted);
  }, [query.data]);

  const ownerSelect = React.useMemo(() => {
    if (!owners) return null;
    return (
      <FormControl variant="standard" sx={{ width: 160, ml: 2 }}>
        <InputLabel id="select-owner-label">Owner</InputLabel>
        <Select
          labelId="select-owner-label"
          id="select-owner"
          value={search.owner}
          variant="standard"
          onChange={(e) => {
            setSearch("owner", e.target.value);
            setSearch("namespace", "0");
          }}
          label="Owner"
          fullWidth
        >
          <MenuItem value="0">All</MenuItem>
          {[...owners.entries()].map(([id, name]) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [owners, search.owner, setSearch]);

  const namespaces = React.useMemo(() => {
    if (!query.data) return;
    const namespaces = query.data.reduce(
      (acc, t) => {
        if (
          !acc[t.namespaceId] &&
          (search.owner === "0" || t.namespaceOwner === search.owner)
        ) {
          acc[t.namespaceId] = t.namespace;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const sorted = Object.entries(namespaces).sort(([, a], [, b]) =>
      (a || "").localeCompare(b || "")
    );

    return new Map(sorted);
  }, [query.data, search.owner]);

  const namespaceSelect = React.useMemo(() => {
    if (!namespaces) return null;
    return (
      <FormControl variant="standard" sx={{ width: 160, ml: 2 }}>
        <InputLabel id="select-namespace-label">Namespace</InputLabel>
        <Select
          labelId="select-namespace-label"
          id="select-namespace"
          value={search.namespace}
          variant="standard"
          onChange={(e) => {
            setSearch("namespace", e.target.value);
          }}
          label="Namespace"
          fullWidth
        >
          <MenuItem value="0">All</MenuItem>
          {[...namespaces.entries()].map(([id, name]) => (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [namespaces, search.namespace, setSearch]);

  const copySchemas = React.useCallback(() => {
    const content = tables
      .map((t) => {
        const fields = Object.entries(t.schema)
          .map(([k, v]) => {
            return `  ${k} ${v.type}`;
          })
          .join("\n");
        return `Table ${t.namespace}.${t.name} {\n` + fields + `\n}\n`;
      })
      .join("\n");
    navigator.clipboard.writeText(content);
  }, [tables]);

  const itemContent = React.useCallback(
    (_: number, t: (typeof tables)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={t.tableId}>
          <TableCell colSpan={2}>
            {t.type === "offchainTable" ? (
              <Box display="flex" alignItems="center">
                <ButtonTable
                  id={t.tableId}
                  name={t.name}
                  fastRender={context.isScrolling}
                />
                <Tooltip title="Off-chain table">
                  <OffChainIcon color="secondary" sx={{ ml: 1 }} />
                </Tooltip>
              </Box>
            ) : (
              <ButtonTable id={t.tableId} name={t.name} />
            )}
          </TableCell>
          <TableCell>
            <ButtonNamespace
              id={t.namespaceId}
              name={t.namespace}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              address={t.namespaceOwner}
              name={t.namespaceOwnerName}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            {context.isScrolling ? (
              <DisplayTableContent table={t} />
            ) : (
              <NoMaxWidthTooltip title={<DisplayTableFieldsChips table={t} />}>
                <Box
                  sx={{
                    cursor: "help",
                  }}
                >
                  <DisplayTableContent table={t} />
                </Box>
              </NoMaxWidthTooltip>
            )}
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
      {ownerSelect}
      {namespaceSelect}
      <Box
        flexGrow="1"
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        marginRight={2}
      >
        <Tooltip
          title={
            <>
              Copy schemas as DBML format.{" "}
              <ExternalLink
                href="https://dbml.dbdiagram.io/docs/"
                title="DBML documentation"
              />
            </>
          }
        >
          <Button variant="outlined" size="small" onClick={copySchemas}>
            Copy schemas
          </Button>
        </Tooltip>
      </Box>
    </DataTableLayout>
  );
};

export default ExploreTables;
