import React from "react";
import { Helmet } from "react-helmet";
import { Alert, Box, List, ListItem, ListItemText } from "@mui/material";
import { isHex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import DisplayTableFieldsChips from "@/components/DisplayTableFieldsChips";
import { getTableId } from "@/api/evedatacore-v2";

const ExploreTable: React.FC = () => {
  const { id } = useParams();

  const table = isHex(id) ? hexToResource(id) : undefined;
  const namespaceId = table
    ? resourceToHex({
        type: "namespace",
        namespace: table.namespace,
        name: "",
      })
    : undefined;

  const query = useQuery({
    queryKey: ["Table", id],
    queryFn: async () =>
      getTableId({ path: { id: id ?? "" } }).then((r) => r.data),
    enabled: !!id,
  });

  if (!id || !table || !namespaceId || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = `${table.name} [${table.namespace}]`;

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
        <></>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <ListItem disableGutters>
            <ListItemText>Id: {table.resourceId}</ListItemText>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText sx={{ my: 0 }}>
              Namespace:{" "}
              <ButtonNamespace id={namespaceId} name={table.namespace} />
            </ListItemText>
          </ListItem>
          {data && (
            <>
              <ListItem disableGutters>
                <ListItemText sx={{ my: 0 }}>
                  Owner:{" "}
                  {data.ownerName ? (
                    <ButtonCharacter
                      address={data.account}
                      name={data.ownerName}
                    />
                  ) : (
                    data.account
                  )}
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText sx={{ my: 0 }}>
                  Fields: <DisplayTableFieldsChips table={data} />
                </ListItemText>
              </ListItem>
            </>
          )}
        </List>
      </PaperLevel1>
      <PaperLevel1 sx={{ mb: 0 }} title="">
        <Alert severity="info">
          Table records are not available in this game cycle.
        </Alert>
      </PaperLevel1>
    </Box>
  );
};

export default ExploreTable;
