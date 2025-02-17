import React from "react";
import { Box, TextField, TableCell } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps } from "@/tools";
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
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Smartcharacters"],
    queryFn: async () => mudSql.listCharacters(),
    staleTime: 1000 * 60 * 15,
  });

  const corporations = React.useMemo(() => {
    if (!query.data) return [];
    const corps: Record<number, { id: string }> = {};
    for (const character of query.data) {
      if (!corps[character.corpId]) {
        corps[character.corpId] = {
          id: character.corpId.toString(),
        };
      }
    }
    const corpsArray = Object.values(corps);
    return filterInProps(corpsArray, debouncedSearch.text, ["id"]);
  }, [query.data, debouncedSearch.text]);

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
    <DataTableLayout
      title="Corporations"
      columns={columns}
      data={corporations}
      itemContent={itemContent}
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
  );
};

export default ExploreCorporations;
