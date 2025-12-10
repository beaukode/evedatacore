import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import BasicListItem from "@/components/ui/BasicListItem";
import ExternalLink from "@/components/ui/ExternalLink";
import TableFunctions from "@/components/tables/TableFunctions";
import { getSystemId } from "@/api/evedatacore-v2";

const ExploreSystem: React.FC = () => {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["System", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getSystemId({ path: { id: id } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!id,
  });

  const data = query.data;

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const title = data ? `${data.name} [${data.namespace}]` : "...";

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
      <PaperLevel1 title={title} loading={query.isFetching} backButton>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Id">{data.id}</BasicListItem>
            <BasicListItem title="Namespace" disableGutters>
              <ButtonNamespace id={data.namespaceId} name={data.namespace} />
            </BasicListItem>
            {data && (
              <>
                {data.ownerName ? (
                  <BasicListItem title="Owner" disableGutters>
                    <ButtonCharacter
                      address={data.account}
                      name={data.ownerName}
                    />
                  </BasicListItem>
                ) : (
                  <BasicListItem title="Owner">{data.account}</BasicListItem>
                )}
                <BasicListItem title="Public Access">
                  {data.publicAccess ? "Yes" : "No"}
                </BasicListItem>
                <BasicListItem title="Contract">{data.contract}</BasicListItem>
                <BasicListItem title="Contract link">
                  <ExternalLink
                    href={`${explorerBaseUrl}/address/${data.contract}`}
                    title={data.contract}
                  />
                </BasicListItem>
              </>
            )}
          </List>
        )}
      </PaperLevel1>
      <TableFunctions
        system={id}
        hideColumns={["system", "namespace", "owner"]}
      />
    </Box>
  );
};

export default ExploreSystem;
