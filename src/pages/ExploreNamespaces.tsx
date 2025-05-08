import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell } from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { filterInProps } from "@/tools";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import { DataTableContext, DataTableColumn } from "@/components/DataTable";
import { columnWidths } from "@/constants";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common },
  { label: "Owner", width: columnWidths.address },
];

const ExploreNamespaces: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Namespaces"],
    queryFn: () => mudSql.listNamespaces(),
  });

  const namespaces = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, [
      "name",
      "namespaceId",
      "owner",
      "ownerName",
    ]);
  }, [query.data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, ns: (typeof namespaces)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={ns.namespaceId}>
          <TableCell>
            <ButtonNamespace
              name={ns.name}
              id={ns.namespaceId}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            <ButtonCharacter
              name={ns.ownerName}
              address={ns.owner}
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
