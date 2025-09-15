import React from "react";
import { Helmet } from "react-helmet";
import { Box, TextField, TableCell } from "@mui/material";
import { getCharacters } from "@/api/evedatacore-v2";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonTribe from "@/components/buttons/ButtonTribe";

const columns: DataTableColumn[] = [
  { label: "Id", width: columnWidths.common, grow: true },
];

const ExploreTribes: React.FC = () => {
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const { data, isFetching } = usePaginatedQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async ({ pageParam }) => {
      const r = await getCharacters({
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [], nextKey: undefined };
      return r.data;
    },
  });

  const tribes = React.useMemo(() => {
    if (!data) return [];
    const tribes: Record<number, { id: string }> = {};
    for (const character of data) {
      if (character.tribeId && !tribes[character.tribeId]) {
        tribes[character.tribeId] = {
          id: character.tribeId.toString(),
        };
      }
    }
    const tribesArray = Object.values(tribes);
    return filterInProps(tribesArray, debouncedSearch.text, ["id"]);
  }, [data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      tribe: (typeof tribes)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={tribe.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <ButtonTribe
                name={tribe.id}
                id={parseInt(tribe.id, 10)}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
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
