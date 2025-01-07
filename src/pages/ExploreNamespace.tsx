import React from "react";
import { Helmet } from "react-helmet";
import { Box, List, ListItem, ListItemText } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import { getNamespace } from "@/api/mudsql/queries";
import DisplayOwner from "@/components/DisplayOwner";
import PaperLevel1 from "@/components/ui/PaperLevel1";

const ExploreNamespace: React.FC = () => {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["Namespace", id],
    queryFn: async () => getNamespace(id ?? "0x"),
    enabled: !!id,
  });

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = data?.name ?? "Loading...";

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1 title={title} loading={query.isFetching} backButton mudChip>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <ListItem disableGutters>
              <ListItemText>Id: {data.namespaceId}</ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText sx={{ my: 0 }}>
                Owner:{" "}
                {data.ownerName && (
                  <DisplayOwner address={data.owner} name={data.ownerName} />
                )}
                {!data.ownerName && data.owner}
              </ListItemText>
            </ListItem>
          </List>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreNamespace;
