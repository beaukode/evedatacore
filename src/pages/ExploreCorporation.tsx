import React from "react";
import { Helmet } from "react-helmet";
import { Avatar, Box, List, TableCell, TextField } from "@mui/material";
import { useParams } from "react-router";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps, tsToDateTime } from "@/tools";
import usePaginatedQuery from "@/tools/usePaginatedQuery";
import { DataTableContext } from "@/components/DataTable";
import { columnWidths } from "@/constants";
import { DataTableColumn } from "@/components/DataTable";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import { getTribeIdCharacters } from "@/api/evedatacore-v2";

const columns: DataTableColumn[] = [
  { label: "Name", width: columnWidths.common, grow: true },
  { label: "Address", width: columnWidths.address },
  { label: "Created At", width: columnWidths.datetime },
];

const ExploreCorporation: React.FC = () => {
  const { id } = useParams();
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const corporationId = Number.parseInt(id ?? "0");

  const query = usePaginatedQuery({
    queryKey: ["CorporationCharacters", id],
    queryFn: async ({ pageParam }) => {
      if (!id) return { items: [] };
      const r = await getTribeIdCharacters({
        path: { id: Number(corporationId) },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!corporationId,
  });

  const members = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, ["name", "account"]);
  }, [query.data, debouncedSearch]);

  const itemContent = React.useCallback(
    (_: number, sm: (typeof members)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={sm.id}>
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
          <TableCell>{tsToDateTime(sm.createdAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );

  if (
    !corporationId ||
    Number.isNaN(corporationId) ||
    (!query.isFetching && !query.data)
  ) {
    return <Error404 />;
  }

  const data = query.data;
  const title = `Corporation ${corporationId}`;

  return (
    <Box
      p={2}
      flexGrow={1}
      overflow="auto"
      display={"flex"}
      flexDirection={"column"}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1
        sx={{ mb: 0 }}
        title={title}
        loading={query.isFetching}
        backButton
      >
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Members count">{data?.length}</BasicListItem>
        </List>
      </PaperLevel1>
      <DataTableLayout
        title="Members"
        columns={columns}
        data={members}
        itemContent={itemContent}
        sx={{ mx: 0 }}
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
      </DataTableLayout>
    </Box>
  );
};

export default ExploreCorporation;
