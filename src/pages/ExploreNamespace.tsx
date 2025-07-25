import React from "react";
import { Helmet } from "react-helmet";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { hexToResource } from "@latticexyz/common";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isHex } from "viem";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import TableTables from "@/components/tables/TableTables";
import TableSystems from "@/components/tables/TableSystems";
import TableFunctions from "@/components/tables/TableFunctions";
import { getNamespaceId } from "@/api/evedatacore-v2";

const ExploreNamespace: React.FC = () => {
  const { id } = useParams();

  const namespace = isHex(id) ? hexToResource(id) : undefined;

  const query = useQuery({
    queryKey: ["Namespace", id],
    queryFn: async () => {
      const r = await getNamespaceId({ path: { id: id ?? "0x" } });
      if (!r.data) return null;
      return r.data;
    },
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
              <ListItemText>Id: {data.id}</ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText sx={{ my: 0 }}>
                Owner:{" "}
                {data.ownerId && (
                  <ButtonCharacter
                    address={data.account}
                    name={data.ownerName}
                  />
                )}
                {!data.ownerId && data.account}
              </ListItemText>
            </ListItem>
          </List>
        )}
      </PaperLevel1>
      <TableTables namespace={id} hideNamespaceColumn />
      <TableSystems namespace={id} hideNamespaceColumn />
      <TableFunctions namespace={id} hideColumns={["namespace", "owner"]} />
    </Box>
  );
};

export default ExploreNamespace;
