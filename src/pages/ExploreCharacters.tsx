import React from "react";
import { Helmet } from "react-helmet";
import { Box, TextField, Avatar, TableCell } from "@mui/material";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import { usePaginatedQuery } from "@/tools/usePaginatedQuery";
import { filterInProps, tsToDateTime } from "@/tools";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { getCharacters } from "@/api/evedatacore-v2";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Address", width: columnWidths.address },
  { label: "Created At", width: columnWidths.datetime },
];

const ExploreCharacters: React.FC = () => {
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
    staleTime: 1000 * 60,
  });

  const smartcharacters = React.useMemo(() => {
    if (!data) return [];
    return filterInProps(
      data,
      debouncedSearch.text,
      ["account", "name", "id"],
      (sm) => sm.account !== "0x0000000000000000000000000000000000000000"
    );
  }, [data, debouncedSearch.text]);

  const itemContent = React.useCallback(
    (
      _: number,
      sm: (typeof smartcharacters)[number],
      context: DataTableContext
    ) => {
      return (
        <React.Fragment key={sm.account}>
          <TableCell colSpan={2}>
            <Box display="flex" alignItems="center">
              <Avatar
                alt={sm.name}
                sx={{ bgcolor: "black", color: "silver", mr: 1 }}
                src="https://artifacts.evefrontier.com/Character/123456789_256.jpg"
                variant="rounded"
              />
              <ButtonCharacter
                name={sm.name}
                address={sm.account}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
          <TableCell>{sm.account}</TableCell>
          <TableCell>{tsToDateTime(sm.createdAt * 1000)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );
  return (
    <>
      <Helmet>
        <title>Characters</title>
      </Helmet>
      <DataTableLayout
        title="Characters"
        columns={columns}
        data={smartcharacters}
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

export default ExploreCharacters;
