import React from "react";
import {
  TextField,
  TableCell,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import PrivateIcon from "@mui/icons-material/Lock";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { filterInProps } from "@/tools";
import { useMudSql } from "@/contexts/AppContext";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { DataTableContext } from "@/components/DataTable";
import ExternalLink from "@/components/ui/ExternalLink";
import ButtonSystem from "@/components/buttons/ButtonSystem";

const columns = ["Name", "Namespace", "Owner", "Contract"];

const ExploreSystems: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    owner: "0",
    namespace: "0",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Systems"],
    queryFn: () => mudSql.listSystems(),
  });

  const systems = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      [
        "name",
        "systemId",
        "contract",
        "namespaceId",
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

  const privateIcon = React.useMemo(
    () => (
      <Tooltip title="Public access is disabled" placement="right" arrow>
        <PrivateIcon color="info" />
      </Tooltip>
    ),
    []
  );

  const itemContent = React.useCallback(
    (_: number, sys: (typeof systems)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={sys.systemId}>
          <TableCell>
            <Box display="flex" alignItems="center">
              <ButtonSystem
                id={sys.systemId}
                name={sys.name}
                fastRender={context.isScrolling}
              />
              {!sys.publicAccess && privateIcon}
            </Box>
          </TableCell>
          <TableCell>
            <ButtonNamespace
              id={sys.namespaceId}
              name={sys.namespace}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              address={sys.namespaceOwner}
              name={sys.namespaceOwnerName}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ExternalLink
              href={`https://explorer.garnetchain.com/address/${sys.contract}`}
              title={sys.contract}
            >
              {sys.contract}
            </ExternalLink>
          </TableCell>
        </React.Fragment>
      );
    },
    [privateIcon]
  );

  return (
    <DataTableLayout
      title="Systems"
      columns={columns}
      data={systems}
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

export default ExploreSystems;
