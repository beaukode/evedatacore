import React from "react";
import {
  TextField,
  TableCell,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { filterInProps } from "@/tools";
import { useMudSql } from "@/contexts/AppContext";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { DataTableContext, DataTableColumn } from "@/components/DataTable";

const columns: DataTableColumn[] = [
  "Signature",
  { label: "Namespace", width: 180 },
  { label: "Owner", width: 250 },
  { label: "System", width: 250 },
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
      if (context.isScrolling) {
        return (
          <React.Fragment key={fn.worldSelector}>
            <TableCell sx={{ fontFamily: "monospace" }}>
              <Button
                sx={{ justifyContent: "flex-start", fontFamily: "monospace" }}
                component={NavLink}
                to={`/explore/functions/${fn.worldSelector}`}
              >
                {fn.signature}
              </Button>
            </TableCell>
            <TableCell sx={{ height: 49.5, px: 3 }}>{fn.namespace}</TableCell>
            <TableCell sx={{ height: 49.5, px: 3 }}>
              {fn.namespaceOwnerName || fn.namespaceOwner}
            </TableCell>
            <TableCell sx={{ height: 49.5, px: 3 }}>{fn.systemName}</TableCell>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={fn.worldSelector}>
            <TableCell sx={{ fontFamily: "monospace" }}>
              <Button
                sx={{ justifyContent: "flex-start", fontFamily: "monospace" }}
                component={NavLink}
                to={`/explore/functions/${fn.worldSelector}`}
              >
                {fn.signature}
              </Button>
            </TableCell>
            <TableCell>
              {fn.namespaceId && fn.namespace && (
                <ButtonNamespace id={fn.namespaceId} name={fn.namespace} />
              )}
            </TableCell>
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
            <TableCell>
              {fn.systemId && fn.systemName && (
                <ButtonSystem id={fn.systemId} name={fn.systemName} />
              )}
            </TableCell>
          </React.Fragment>
        );
      }
    },
    []
  );

  return (
    <DataTableLayout
      title="Functions"
      columns={columns}
      data={functions}
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
        fullWidth
      />
      {ownerSelect}
      {namespaceSelect}
    </DataTableLayout>
  );
};

export default ExploreFunctions;
