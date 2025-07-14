import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell } from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { DataTableContext, DataTableColumn } from "@/components/DataTable";
import ButtonGeneric from "@/components/buttons/ButtonGeneric";
import { columnWidths } from "@/constants";
import { getFunctions, GetFunctionsResponse } from "@/api/evedatacore-v2";
import SelectOwner from "@/components/form/SelectOwner";
import SelectNamespace from "@/components/form/SelectNamespace";

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

  const query = usePaginatedQuery({
    queryKey: ["Functions"],
    queryFn: async ({ pageParam }) => {
      const r = await getFunctions({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const functions = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(
      query.data,
      debouncedSearch.text,
      [
        "id",
        "signature",
        "systemName",
        "signature",
        "ownerName",
        "namespace",
        "systemSelector",
      ],
      (sys) =>
        (search.owner === "0" || sys.account === search.owner) &&
        (search.namespace === "0" || sys.namespaceId === search.namespace)
    );
  }, [query.data, search.owner, search.namespace, debouncedSearch.text]);

  const filterNamespace = React.useCallback(
    (t: GetFunctionsResponse["items"][number]) =>
      search.owner === "0" || t.account === search.owner,
    [search.owner]
  );

  const itemContent = React.useCallback(
    (_: number, fn: (typeof functions)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={fn.id}>
          <TableCell colSpan={2}>
            <ButtonGeneric
              to={`/explore/functions/${fn.id}`}
              fastRender={context.isScrolling}
            >
              {fn.signature}
            </ButtonGeneric>
          </TableCell>
          <TableCell>
            <ButtonNamespace
              id={fn.namespaceId}
              name={fn.namespace}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>
            {fn.account && (
              <ButtonCharacter
                address={fn.account}
                name={fn.ownerName}
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

export default ExploreFunctions;
