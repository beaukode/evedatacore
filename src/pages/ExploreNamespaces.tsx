import React from "react";
import { TextField, TableCell, Button } from "@mui/material";
import { NavLink } from "react-router";
import useQuerySearch from "@/tools/useQuerySearch";
import { useQuery } from "@tanstack/react-query";
import { listNamespaces } from "@/api/mudsql";
import { filterInProps } from "@/tools";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import DisplayOwner from "@/components/DisplayOwner";

const columns = ["Name", "Owner"];

const ExploreNamespaces: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const query = useQuery({
    queryKey: ["Namespaces"],
    queryFn: () => listNamespaces(),
    retry: false,
    throwOnError: true,
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
    (_: number, ns: (typeof namespaces)[number]) => {
      return (
        <React.Fragment key={ns.namespaceId}>
          <TableCell>
            <Button
              sx={{ justifyContent: "flex-start" }}
              component={NavLink}
              to={`/explore/namespaces/${ns.namespaceId}`}
            >
              {ns.name}
            </Button>
          </TableCell>
          <TableCell sx={{ height: 49.5 }}>
            {ns.ownerName ? (
              <DisplayOwner name={ns.ownerName} address={ns.owner} />
            ) : (
              ns.owner
            )}
          </TableCell>
        </React.Fragment>
      );
    },
    []
  );

  return (
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
      />
    </DataTableLayout>
  );
};

export default ExploreNamespaces;
