import React from "react";
import { Helmet } from "react-helmet";
import { Avatar, Box, List, TableCell, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import Error404 from "./Error404";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import useQuerySearch from "@/tools/useQuerySearch";
import { filterInProps, tsToDateTime } from "@/tools";
import { DataTableContext } from "@/components/DataTable";
import { columnWidths } from "@/constants";
import { DataTableColumn } from "@/components/DataTable";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import DataTableLayout from "@/components/layouts/DataTableLayout";

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
  const mudSql = useMudSql();

  const corporationId = Number.parseInt(id ?? "0");

  const query = useQuery({
    queryKey: ["CorporationCharacters", id],
    queryFn: async () =>
      mudSql.listCharacters({ corporationsId: corporationId }),
    enabled: !!id,
  });

  const members = React.useMemo(() => {
    if (!query.data) return [];
    return filterInProps(query.data, debouncedSearch.text, ["name", "address"]);
  }, [query.data, debouncedSearch]);

  const itemContent = React.useCallback(
    (_: number, sm: (typeof members)[number], context: DataTableContext) => {
      return (
        <React.Fragment key={sm.address}>
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
                address={sm.address}
                fastRender={context.isScrolling}
              />
            </Box>
          </TableCell>
          <TableCell>{sm.address}</TableCell>
          <TableCell>{tsToDateTime(sm.createdAt)}</TableCell>
        </React.Fragment>
      );
    },
    []
  );

  if (
    !corporationId ||
    Number.isNaN(corporationId) ||
    (!query.isLoading && !query.data)
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
