import React from "react";
import { Helmet } from "react-helmet";
import { TextField, TableCell } from "@mui/material";
import useQuerySearch from "@/tools/useQuerySearch";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { DataTableContext } from "@/components/DataTable";
import { DataTableColumn } from "@/components/DataTable";
import { getSolarsystems, SolarSystem } from "@/api/evedatacore-v2";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { filterInProps } from "@/tools";
import ButtonGeneric from "@/components/buttons/ButtonGeneric";

const columns: DataTableColumn<SolarSystem>[] = [
  {
    label: "Id",
    width: 120,
    sort: (a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10),
  },
  {
    label: "Name",
    width: 400,
    grow: true,
    initialSort: "asc",
    sort: (a, b) => a.name.localeCompare(b.name ?? ""),
  },
  {
    label: "Occupied L-Points",
    width: 210,
    sort: (a, b) => (a.lpoints.occupied ?? 0) - (b.lpoints.occupied ?? 0),
  },
  {
    label: "Total L-Points",
    width: 210,
    sort: (a, b) => (a.lpoints.count ?? 0) - (b.lpoints.count ?? 0),
  },
];

const ExploreSolarsystems: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const { data, isFetching } = usePaginatedQuery({
    queryKey: ["Solarsystems"],
    queryFn: async ({ pageParam }) => {
      const r = await getSolarsystems({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
    staleTime: 1000 * 60,
  });

  const solarsystems = React.useMemo(() => {
    if (!data) return [];
    return filterInProps(data, debouncedSearch.text, ["id", "name"]);
  }, [data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      ss: (typeof solarsystems)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={ss.id}>
          <TableCell>{ss.id}</TableCell>
          <TableCell colSpan={2}>
            <ButtonGeneric
              fastRender={context.isScrolling}
              to={`/explore/solarsystems/${ss.id}`}
            >
              {ss.name}
            </ButtonGeneric>
          </TableCell>
          <TableCell>{ss.lpoints.occupied}</TableCell>
          <TableCell>{ss.lpoints.count}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Solar systems</title>
      </Helmet>
      <DataTableLayout
        title="Solar systems"
        columns={columns}
        loading={isFetching}
        data={solarsystems}
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

export default ExploreSolarsystems;
