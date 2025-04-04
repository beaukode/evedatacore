import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { isHex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { hexToResource, resourceToHex } from "@latticexyz/common";
import { useMudSql } from "@/contexts/AppContext";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";
import BasicListItem from "@/components/ui/BasicListItem";
import ExternalLink from "@/components/ui/ExternalLink";
import TableFunctions from "@/components/tables/TableFunctions";

const ExploreSystem: React.FC = () => {
  const { id } = useParams();
  const mudSql = useMudSql();

  const system = isHex(id) ? hexToResource(id) : undefined;
  const namespaceId = system
    ? resourceToHex({
        type: "namespace",
        namespace: system.namespace,
        name: "",
      })
    : undefined;

  const query = useQuery({
    queryKey: ["System", id],
    queryFn: async () => mudSql.getSystem(id ?? "0x"),
    enabled: !!id,
  });

  if (!id || !system || !namespaceId || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const title = `${system.name} [${system.namespace}]`;

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
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Id">{system.resourceId}</BasicListItem>
          <BasicListItem title="Namespace" disableGutters>
            <ButtonNamespace id={namespaceId} name={system.namespace} />
          </BasicListItem>
          {data && (
            <>
              {data.namespaceOwnerName ? (
                <BasicListItem title="Owner" disableGutters>
                  <ButtonCharacter
                    address={data.namespaceOwner}
                    name={data.namespaceOwnerName}
                  />
                </BasicListItem>
              ) : (
                <BasicListItem title="Owner">
                  {data.namespaceOwner}
                </BasicListItem>
              )}
              <BasicListItem title="Public Access">
                {data.publicAccess ? "Yes" : "No"}
              </BasicListItem>
              <BasicListItem title="Contract">{data.contract}</BasicListItem>
              <BasicListItem title="Contract link">
                <ExternalLink
                  href={`https://explorer.pyropechain.com/address/${data.contract}`}
                  title={data.contract}
                />
              </BasicListItem>
            </>
          )}
        </List>
      </PaperLevel1>
      <TableFunctions
        systems={[id]}
        hideColumns={["system", "namespace", "owner"]}
      />
    </Box>
  );
};

export default ExploreSystem;
