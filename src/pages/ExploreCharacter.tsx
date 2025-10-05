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
import ButtonTribe from "@/components/buttons/ButtonTribe";
import { getCharacterId } from "@/api/evedatacore-v2";
import TableLogbook from "@/components/tables/TableLogbook";

const ExploreCharacter: React.FC = () => {
  const { address } = useParams();
  const [fetched, setFetched] = React.useState({
    character: false,
    assemblies: false,
    killmails: false,
    namespaces: false,
    tables: false,
    systems: false,
    functions: false,
  });

  const query = useQuery({
    queryKey: ["SmartcharactersById", address],
    queryFn: async () => {
      const r = await getCharacterId({ path: { id: address ?? "" } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!address,
  });

  React.useEffect(() => {
    setFetched((s) => ({ ...s, character: true }));
  }, [query.isFetched]);

  const isLogbookEnabled = React.useMemo(() => {
    return Object.values(fetched).every((f) => f);
  }, [fetched]);

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
          <BasicListItem title="Item ID">
            {data?.itemId} [{data?.typeId}]
          </BasicListItem>
          <BasicListItem title="Address">{data?.account}</BasicListItem>
          <BasicListItem title="Created At">
            {tsToDateTime(data?.createdAt)}
          </BasicListItem>
          <BasicListItem title="Eve balance">
            {formatCrypto(data?.balance || "0")}
          </BasicListItem>
          <BasicListItem title="Tribe" disableGutters>
            <ButtonTribe
              id={data?.tribeId}
              name={data?.tribeName}
              ticker={data?.tribeTicker}
            />
          </BasicListItem>
          <BasicListItem title="Joined At">
            {tsToDateTime(data?.tribeJoinedAt)}
          </BasicListItem>
        </List>
      </PaperLevel1>
      <TableAssemblies
        owner={address}
        onFetched={() => setFetched((s) => ({ ...s, assemblies: true }))}
      />
      <TableKillmails
        characterId={data?.id}
        onFetched={() => setFetched((s) => ({ ...s, killmails: true }))}
      />
      <TableNamespaces
        owner={address}
        onFetched={() => setFetched((s) => ({ ...s, namespaces: true }))}
      />
      <TableTables
        owner={address}
        onFetched={() => setFetched((s) => ({ ...s, tables: true }))}
      />
      <TableSystems
        owner={address}
        onFetched={() => setFetched((s) => ({ ...s, systems: true }))}
      />
      <TableFunctions
        owner={address}
        hideColumns={["owner"]}
        onFetched={() => setFetched((s) => ({ ...s, functions: true }))}
      />
      <TableLogbook enabled={isLogbookEnabled} owner={address} />
    </Box>
  );
};

export default ExploreCharacter;
