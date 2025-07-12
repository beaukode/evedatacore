import React from "react";
import { Helmet } from "react-helmet";
import { Box, TextField, TableCell } from "@mui/material";
import { getCharacters } from "@/api/evedatacore-v2";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
import { usePaginatedQuery } from "@/tools/usePaginatedQuery";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import ButtonCorporation from "@/components/buttons/ButtonCorporation";

const columns: DataTableColumn[] = [
  { label: "Id", width: columnWidths.common, grow: true },
];

const ExploreCorporations: React.FC = () => {
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

  const corporations = React.useMemo(() => {
    if (!data) return [];
    const corps: Record<number, { id: string }> = {};
    for (const character of data) {
      if (character.tribeId && !corps[character.tribeId]) {
        corps[character.tribeId] = {
          id: character.tribeId.toString(),
        };
      }
    }
    const corpsArray = Object.values(corps);
    return filterInProps(corpsArray, debouncedSearch.text, ["id"]);
  }, [data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      corp: (typeof corporations)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={corp.id}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <ButtonCorporation
                name={corp.id}
                id={corp.id}
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
        <title>Corporations</title>
      </Helmet>
      <DataTableLayout
        title="Corporations"
        columns={columns}
        data={corporations}
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

export default ExploreCorporations;
