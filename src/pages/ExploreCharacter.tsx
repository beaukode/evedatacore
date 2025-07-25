import React from "react";
import { Helmet } from "react-helmet";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
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
import { getCharacterId } from "@/api/evedatacore-v2";

const ExploreCharacter: React.FC = () => {
  const { address } = useParams();

  const query = useQuery({
    queryKey: ["SmartcharactersById", address],
    queryFn: async () => {
      const r = await getCharacterId({ path: { id: address ?? "" } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!address,
  });

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
          <BasicListItem title="Address">{data?.account}</BasicListItem>
          <BasicListItem title="Corporation Id" disableGutters>
            <ButtonCorporation
              name={data?.tribeId?.toString()}
              id={data?.tribeId?.toString()}
              fastRender={false}
            />
          </BasicListItem>
          <BasicListItem title="Created At">
            {tsToDateTime(data?.createdAt)}
          </BasicListItem>
          <BasicListItem title="Eve balance">
            {formatCrypto(data?.balance || "0")}
          </BasicListItem>
        </List>
      </PaperLevel1>
      <TableAssemblies owner={address} />
      <TableKillmails characterId={data?.id} />
      <TableNamespaces owner={address} />
      <TableTables owner={address} />
      <TableSystems owner={address} />
      <TableFunctions owner={address} hideColumns={["owner"]} />
    </Box>
  );
};

export default ExploreCharacter;
