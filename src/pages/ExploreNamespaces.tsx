import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell } from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { DataTableContext, DataTableColumn } from "@/components/DataTable";
import { columnWidths } from "@/constants";
import { getNamespaces, Namespace } from "@/api/evedatacore-v2";

const columns: DataTableColumn<Namespace>[] = [
  {
    label: "Name",
    width: columnWidths.common,
    sort: (a, b) => a.name.localeCompare(b.name),
    initialSort: "asc",
  },
  {
    label: "Owner",
    width: columnWidths.address,
    sort: (a, b) =>
      (a.ownerName ?? a.account).localeCompare(b.ownerName ?? b.account),
  },
];

const ExploreNamespaces: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = usePaginatedQuery({
    queryKey: ["Namespaces"],
    queryFn: async ({ pageParam }) => {
      const r = await getNamespaces({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const namespaces = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "name",
      "id",
      "account",
      "ownerName",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, ns: (typeof namespaces)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={ns.id}>
          <TableCell>
            <ButtonNamespace
              name={ns.name}
              id={ns.id}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              name={ns.ownerName}
              address={ns.account}
              fastRender={context.isScrolling}
            />
          </TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
    <>
      <Helmet>
        <title>Namespaces</title>
      </Helmet>
      <DataTableLayout
        title="Namespaces"
        columns={columns}
        data={namespaces}
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
      </DataTableLayout>
    </>
  );
};

export default ExploreNamespaces;
