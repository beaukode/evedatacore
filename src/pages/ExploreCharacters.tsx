import React from "react";
import { Helmet } from "react-helmet";
import { Box, TextField, Avatar, TableCell } from "@mui/material";
import { DataTableColumn, DataTableContext } from "@/components/DataTable";
import useQuerySearch from "@/tools/useQuerySearch";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { filterInProps, tsToDateTime } from "@/tools";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import ButtonTribe from "@/components/buttons/ButtonTribe";
import { columnWidths } from "@/constants";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { Character, getCharacters } from "@/api/evedatacore-v2";

const columns: DataTableColumn<Character>[] = [
  {
    label: "Name",
    width: columnWidths.common,
    grow: true,
    sort: (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0,
  },
  {
    label: "Tribe",
    width: columnWidths.common,
    sort: (a, b) => a.tribeName?.localeCompare(b.tribeName ?? "") ?? 0,
  },
  {
    label: "Address",
    width: columnWidths.address,
    sort: (a, b) => a.account?.localeCompare(b.account ?? "") ?? 0,
  },
  {
    label: "Created At",
    width: columnWidths.datetime,
    sort: (a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0),
    initialSort: "desc",
  },
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
      ["account", "name", "id", "tribeName", "tribeTicker"],
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
          <TableCell>
            <ButtonTribe
              id={sm.tribeId}
              name={sm.tribeName}
              ticker={sm.tribeTicker}
              fastRender={context.isScrolling}
            />
          </TableCell>
          <TableCell>{sm.account}</TableCell>
          <TableCell>{tsToDateTime(sm.createdAt)}</TableCell>
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
