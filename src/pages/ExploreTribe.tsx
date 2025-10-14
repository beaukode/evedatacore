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
import ExternalLink from "@/components/ui/ExternalLink";
import DataTableLayout from "@/components/layouts/DataTableLayout";
import {
  getTribeIdCharacters,
  getTribeId,
  Character,
} from "@/api/evedatacore-v2";
import { useQuery } from "@tanstack/react-query";

const columns: DataTableColumn<Character>[] = [
  {
    label: "Name",
    width: columnWidths.common,
    grow: true,
    sort: (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0,
    initialSort: "asc",
  },
  {
    label: "Address",
    width: columnWidths.address,
    sort: (a, b) => a.account?.localeCompare(b.account ?? "") ?? 0,
  },
  {
    label: "Joined At",
    width: columnWidths.datetime,
    sort: (a, b) => (a.tribeJoinedAt ?? 0) - (b.tribeJoinedAt ?? 0),
  },
];

const ExploreTribe: React.FC = () => {
  const { id } = useParams();
  const [search, setSearch, debouncedSearch] = useQuerySearch({
    text: "",
  });

  const tribeId = Number.parseInt(id ?? "0");

  const query = useQuery({
    queryKey: ["Tribe", id],
    queryFn: async () => {
      const r = await getTribeId({ path: { id: tribeId } });
      return r.data;
    },
  });

  const membersQuery = usePaginatedQuery({
    queryKey: ["TribeMembers", id],
    queryFn: async ({ pageParam }) => {
      if (!id) return { items: [] };
      const r = await getTribeIdCharacters({
        path: { id: Number(tribeId) },
        query: { startKey: pageParam },
      });
      if (!r.data) return { items: [] };
      return r.data;
    },
    enabled: !!tribeId,
  });

  const members = React.useMemo(() => {
    if (!membersQuery.data) return [];
    return filterInProps(membersQuery.data, debouncedSearch.text, [
      "name",
      "account",
    ]);
  }, [membersQuery.data, debouncedSearch]);

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
          <TableCell>{tsToDateTime(sm.tribeJoinedAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );

  if (!tribeId || Number.isNaN(tribeId) || (!query.isFetching && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title =
    data?.name && data.ticker ? `[${data.ticker}] ${data.name}` : "...";

  return (
    <Box
      p={2}
      flexGrow={1}
      overflow="auto"
      display={"flex"}
      flexDirection={"column"}
    >
      {!query.isLoading && data && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      <PaperLevel1
        sx={{ mb: 0 }}
        title={title}
        loading={membersQuery.isFetching}
        backButton
      >
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Id">{data?.id}</BasicListItem>
          <BasicListItem title="Ticker">{data?.ticker}</BasicListItem>
          <BasicListItem title="Name">{data?.name}</BasicListItem>
          <BasicListItem title="Founded At">
            {tsToDateTime(data?.foundedAt)}
          </BasicListItem>
          <BasicListItem title="Description">{data?.description}</BasicListItem>
          <BasicListItem title="Url">
            {data?.url && (
              <ExternalLink href={data?.url} title={title}>
                {data?.url}
              </ExternalLink>
            )}
          </BasicListItem>
          <BasicListItem title="Members count">
            {data?.memberCount}
          </BasicListItem>
        </List>
      </PaperLevel1>
      <DataTableLayout
        title="Members"
        columns={columns}
        data={members}
        itemContent={itemContent}
        sx={{ mx: 0 }}
        loading={membersQuery.isFetching}
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

export default ExploreTribe;
