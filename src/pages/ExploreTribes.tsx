import React from "react";
import { Helmet } from "react-helmet";
import { Box, TextField, TableCell } from "@mui/material";
import { getTribes } from "@/api/evedatacore-v2";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps, tsToDateTime } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonTribe from "@/components/buttons/ButtonTribe";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Members", width: 100 },
  { label: "Founded At", width: columnWidths.datetime },
];

const ExploreTribes: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const { data, isFetching } = usePaginatedQuery({
    queryKey: ["Tribes"],
    queryFn: async ({ pageParam }) => {
      const r = await getTribes({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const tribes = React.useMemo(() => {
    if (!data) return [];
    return filterInProps(data, debouncedSearch.text, ["id", "name", "ticker"]);
  }, [data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (_: number, tribe: (typeof tribes)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={tribe.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <ButtonTribe
                name={tribe.name}
                id={parseInt(tribe.id, 10)}
                ticker={tribe.ticker}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
          <TableCell>{tribe.memberCount}</TableCell>
          <TableCell>{tsToDateTime(tribe.foundedAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Tribes</title>
      </Helmet>
      <DataTableLayout
        title="Tribes"
        columns={columns}
        data={tribes}
        itemContent={itemContent}
        loading={isFetching}
      >
        <TextField
          label="Search"
          value={search.text}
          onChange={(e) =>
            setSearch(
              "text",
              e.currentTarget.value.substring(0, 255).toLowerCase()
            )
          }
          fullWidth
        />
      </DataTableLayout>
    </>
  );
};

export default ExploreTribes;
