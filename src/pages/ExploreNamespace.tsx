import React from "react";
import { Helmet } from "react-helmet";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { hexToResource } from "@latticexyz/common";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isHex } from "viem";
import { useMudSql } from "@/contexts/AppContext";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import TableTables from "@/components/tables/TableTables";
import TableSystems from "@/components/tables/TableSystems";
import TableFunctions from "@/components/tables/TableFunctions";

const ExploreNamespace: React.FC = () => {
  const { id } = useParams();
  const mudSql = useMudSql();

  const namespace = isHex(id) ? hexToResource(id) : undefined;

  const query = useQuery({
    queryKey: ["Namespace", id],
    queryFn: async () => mudSql.getNamespace(id ?? "0x"),
    enabled: !!id,
  });

  if (!id || !namespace || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = namespace.namespace;

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1 title={title} loading={query.isFetching} backButton>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <ListItem disableGutters>
              <ListItemText>Id: {data.namespaceId}</ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText sx={{ my: 0 }}>
                Owner:{" "}
                {data.ownerName && (
                  <ButtonCharacter address={data.owner} name={data.ownerName} />
                )}
                {!data.ownerName && data.owner}
              </ListItemText>
            </ListItem>
          </List>
        )}
      </PaperLevel1>
      <TableTables namespace={id} hideNamespaceColumn />
      <TableSystems namespaces={[id]} hideNamespaceColumn />
      <TableFunctions namespaces={[id]} hideColumns={["namespace", "owner"]} />
    </Box>
  );
};

export default ExploreNamespace;
