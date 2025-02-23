import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import { formatCrypto, tsToDateTime } from "@/tools";
import Error404 from "./Error404";
import TableNamespaces from "@/components/tables/TableNamespaces";
import TableTables from "@/components/tables/TableTables";
import TableSystems from "@/components/tables/TableSystems";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import TableAssemblies from "@/components/tables/TableAssemblies";
import TableKillmails from "@/components/tables/TableKillmails";
import TableFunctions from "@/components/tables/TableFunctions";
import ButtonCorporation from "@/components/buttons/ButtonCorporation";

const ExploreCharacter: React.FC = () => {
  const { address } = useParams();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartcharactersById", address],
    queryFn: async () => mudSql.getCharacter(address || "0x0"),
    enabled: !!address,
  });

  const queryBalance = useQuery({
    queryKey: ["CharacterBalanceById", address],
    queryFn: async () => mudSql.getEveBalance(address || "0x0"),
    enabled: !!address,
  });

  const queryNamespaces = useQuery({
    queryKey: ["Namespaces", address],
    queryFn: async () => mudSql.listNamespaces({ owners: address }),
    enabled: !!query.data?.id,
  });

  const namespaces = queryNamespaces.data || [];

  if (!address || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const name = data?.name || "...";
  return (
    <Box p={2}>
      {!query.isLoading && data && (
        <Helmet>
          <title>{data.name}</title>
        </Helmet>
      )}
      <PaperLevel1 title={name} loading={query.isFetching} backButton>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Id">{data?.id}</BasicListItem>
          <BasicListItem title="Address">{data?.address}</BasicListItem>
          <BasicListItem title="Corporation Id" disableGutters>
            <ButtonCorporation
              name={data?.corpId?.toString()}
              id={data?.corpId?.toString()}
              fastRender={false}
            />
          </BasicListItem>
          <BasicListItem title="Created At">
            {tsToDateTime(data?.createdAt)}
          </BasicListItem>
          <BasicListItem title="Eve balance">
            {queryBalance.data?.value === undefined
              ? ""
              : formatCrypto(queryBalance.data?.value || "0")}
          </BasicListItem>
        </List>
      </PaperLevel1>
      <TableAssemblies owner={address} />
      <TableKillmails characterId={data?.id} />
      <TableNamespaces address={address} />
      <TableTables namespaces={namespaces.map((ns) => ns.namespaceId)} />
      <TableSystems namespaces={namespaces.map((ns) => ns.namespaceId)} />
      <TableFunctions
        namespaces={namespaces.map((ns) => ns.namespaceId)}
        hideColumns={["owner"]}
      />
    </Box>
  );
};

export default ExploreCharacter;
