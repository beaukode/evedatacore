import React from "react";
import { Helmet } from "react-helmet";
import {
  TextField,
  TableCell,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { filterInProps } from "@/tools";
import { useMudSql } from "@/contexts/AppContext";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { DataTableContext, DataTableColumn } from "@/components/DataTable";
import ButtonGeneric from "@/components/buttons/ButtonGeneric";
import { columnWidths } from "@/constants";

const columns: DataTableColumn[] = [
  { label: "Signature", width: 600, grow: true },
  { label: "Namespace", width: columnWidths.common },
  { label: "Owner", width: columnWidths.address },
  { label: "System", width: columnWidths.common },
];

const ExploreFunctions: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    owner: "0",
    namespace: "0",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Functions"],
    queryFn: () => mudSql.listFunctions(),
    retry: false,
  });

  const functions = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      [
        "worldSelector",
        "signature",
        "systemName",
        "signature",
        "namespaceOwner",
        "namespaceOwnerName",
      ],
      (sys) =>
        (search.owner === "0" || sys.namespaceOwner === search.owner) &&
        (search.namespace === "0" || sys.namespaceId === search.namespace)
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
      (acc, { namespaceId, namespaceOwner, namespace }) => {
        if (!(namespaceId && namespace)) return acc;
        if (
          !acc[namespaceId] &&
          (search.owner === "0" || namespaceOwner === search.owner)
        ) {
          acc[namespaceId] = namespace;
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
      <FormControl variant="standard" sx={{ width: 160, mx: 2 }}>
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

  const itemContent = React.useCallback(
    (_: number, fn: (typeof functions)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={fn.worldSelector}>
          <TableCell colSpan={2}>
            <ButtonGeneric
              to={`/explore/functions/${fn.worldSelector}`}
              fastRender={context.isScrolling}
            >
              {fn.signature}
            </ButtonGeneric>
          </TableCell>
          <TableCell>
            {fn.namespaceId && fn.namespace && (
              <ButtonNamespace
                id={fn.namespaceId}
                name={fn.namespace}
                fastRender={context.isScrolling}
              />
            )}
          </TableCell>
          <TableCell>
            {fn.namespaceOwner && (
              <ButtonCharacter
                address={fn.namespaceOwner}
                name={fn.namespaceOwnerName}
                fastRender={context.isScrolling}
              />
            )}
          </TableCell>
          <TableCell>
            {fn.systemId && fn.systemName && (
              <ButtonSystem
                id={fn.systemId}
                name={fn.systemName}
                fastRender={context.isScrolling}
              />
            )}
          </TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
    <>
      <Helmet>
        <title>Functions</title>
      </Helmet>
      <DataTableLayout
        title="Functions"
        columns={columns}
        data={functions}
        itemContent={itemContent}
        loading={query.isFetching}
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
          fullWidth
        />
        {ownerSelect}
        {namespaceSelect}
      </DataTableLayout>
    </>
  );
};

export default ExploreFunctions;
