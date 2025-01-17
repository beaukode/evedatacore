import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import Error404 from "./Error404";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import ButtonSystem from "@/components/buttons/ButtonSystem";
import ButtonNamespace from "@/components/buttons/ButtonNamespace";

const ExploreFunction: React.FC = () => {
  const { id } = useParams();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["Function", id],
    queryFn: async () => mudSql.getFunction(id || "0x"),
    enabled: !!id,
  });

  const title = React.useMemo(() => {
    if (!query.data) return "...";
    return query.data.signature.split("(")[0] || "function";
  }, [query.data]);

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PaperLevel1 title={title} loading={query.isFetching} backButton>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="World selector">
              {data.worldSelector}
            </BasicListItem>
            <BasicListItem title="Signature">
              <span style={{ fontFamily: "monospace" }}>{data.signature}</span>
            </BasicListItem>
            <BasicListItem
              title="Owner"
              disableGutters={Boolean(
                data.namespaceOwner && data.namespaceOwnerName
              )}
            >
              {data.namespaceOwner && (
                <>
                  {data.namespaceOwnerName && (
                    <ButtonCharacter
                      address={data.namespaceOwner}
                      name={data.namespaceOwnerName}
                    />
                  )}
                  {!data.namespaceOwnerName && data.namespaceOwner}
                </>
              )}
            </BasicListItem>
            <BasicListItem
              title="Namespace"
              disableGutters={Boolean(data.namespaceId && data.namespace)}
            >
              {data.namespaceId && data.namespace && (
                <ButtonNamespace id={data.namespaceId} name={data.namespace} />
              )}
            </BasicListItem>
            <BasicListItem
              title="System"
              disableGutters={Boolean(data.systemId && data.systemName)}
            >
              {data.systemId && data.systemName && (
                <ButtonSystem id={data.systemId} name={data.systemName} />
              )}
            </BasicListItem>
            <BasicListItem title="System selector">
              {data.systemSelector}
            </BasicListItem>
          </List>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default ExploreFunction;
