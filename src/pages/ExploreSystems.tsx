import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell, Box, Tooltip } from "@mui/material";
import PrivateIcon from "@mui/icons-material/Lock";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import { usePaginatedQuery } from "@/tools/usePaginatedQuery";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import SelectOwner from "@/components/form/SelectOwner";
import SelectNamespace from "@/components/form/SelectNamespace";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import ExternalLink from "@/components/ui/ExternalLink";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import { columnWidths } from "@/constants";
import { getSystems, GetSystemsResponse } from "@/api/evedatacore-v2";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Namespace", width: columnWidths.common },
  { label: "Owner", width: columnWidths.address },
  { label: "Contract", width: columnWidths.address },
];

const ExploreSystems: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
    owner: "0",
    namespace: "0",
  });

  const query = usePaginatedQuery({
    queryKey: ["Systems"],
    queryFn: async ({ pageParam }) => {
      const r = await getSystems({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const systems = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      [
        "name",
        "id",
        "contract",
        "namespaceId",
        "account",
        "ownerName",
        "namespace",
      ],
      (sys) =>
        (search.owner === "0" || sys.account === search.owner) &&
        (search.namespace === "0" || sys.namespaceId === search.namespace)
    );
  }, [query.data, search.owner, search.namespace, debouncedSearch.text]);

  const privateIcon = React.useMemo(
    () => (
      <Tooltip title="Public access is disabled" placement="right" arrow>
        <PrivateIcon color="info" />
      </Tooltip>
    ),
    []
  );

  const filterNamespace = React.useCallback(
    (t: GetSystemsResponse["items"][number]) =>
      search.owner === "0" || t.account === search.owner,
    [search.owner]
  );

  const itemContent = React.useCallback(
    (_: number, sys: (typeof systems)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={sys.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <ButtonSystem
                id={sys.id}
                name={sys.name}
                fastRender={context.isScrolling}
              />
              {!sys.publicAccess && privateIcon}
            </Box>
          </TableCell>
          <TableCell>
            <ButtonNamespace
              id={sys.namespaceId ?? ""}
              name={sys.namespace ?? ""}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              address={sys.account ?? ""}
              name={sys.ownerName ?? ""}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ExternalLink
              href={`https://explorer.pyropechain.com/address/${sys.contract}`}
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
    <>
      <Helmet>
        <title>Systems</title>
      </Helmet>
      <DataTableLayout
        title="Systems"
        columns={columns}
        data={systems}
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
        <SelectOwner
          value={search.owner}
          onChange={(value) => {
            setSearch("owner", value);
            setSearch("namespace", "0");
          }}
          items={query.data}
        />
        <SelectNamespace
          value={search.namespace}
          onChange={(value) => {
            setSearch("namespace", value);
          }}
          items={query.data}
          filter={filterNamespace}
        />
      </DataTableLayout>
    </>
  );
};

export default ExploreSystems;
