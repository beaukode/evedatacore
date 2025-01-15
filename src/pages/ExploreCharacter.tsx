import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import { formatCrypto, ldapDate, tsToDateTime } from "@/tools";
import DisplaySolarsystem from "@/components/DisplaySolarsystem";
import DisplayAssembly from "@/components/DisplayAssembly";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import DisplayOwner from "@/components/DisplayOwner";
import Error404 from "./Error404";
import TableNamespaces from "@/components/tables/TableNamespaces";
import TableTables from "@/components/tables/TableTables";
import TableSystems from "@/components/tables/TableSystems";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";

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

  const queryAssemblies = useQuery({
    queryKey: ["Assemblies", address],
    queryFn: async () => mudSql.listAssemblies({ owners: address }),
    staleTime: 1000 * 60,
    enabled: !!query.data?.id,
  });

  const killmails = useQuery({
    queryKey: ["Killmails", address],
    queryFn: async () => mudSql.listKillmails({ characterId: query.data?.id }),
    enabled: !!query.data?.id,
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
    <Box p={2} flexGrow={1} overflow="auto">
      {!query.isLoading && data && (
        <Helmet>
          <title>{data.name}</title>
        </Helmet>
      )}
      <PaperLevel1 title={name} loading={query.isFetching} backButton>
        <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
          <BasicListItem title="Id">{data?.id}</BasicListItem>
          <BasicListItem title="Address">{data?.address}</BasicListItem>
          <BasicListItem title="Corporation Id">{data?.corpId}</BasicListItem>
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
      <PaperLevel1 title="Assemblies" loading={queryAssemblies.isFetching}>
        {queryAssemblies.data && (
          <>
            {queryAssemblies.data.length === 0 && (
              <Typography variant="body1">None</Typography>
            )}
            {queryAssemblies.data.length > 0 && (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Solar system</TableCell>
                    <TableCell>Anchored At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryAssemblies.data.map((sa) => {
                    const isoDate = new Date(sa.anchoredAt).toISOString();
                    const date = isoDate.substring(0, 10);
                    const time = isoDate.substring(11, 19);
                    return (
                      <TableRow key={sa.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <DisplayAssemblyIcon
                              typeId={sa.typeId}
                              stateId={sa.state}
                              tooltip
                            />
                            <DisplayAssembly id={sa.id} name={sa.name} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <DisplaySolarsystem
                            solarSystemId={sa.solarSystemId}
                          />
                        </TableCell>
                        <TableCell>{`${date} ${time}`}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </PaperLevel1>
      <PaperLevel1 title="Killmails" loading={killmails.isFetching}>
        {killmails.data && (
          <>
            {killmails.data.length === 0 && (
              <Typography variant="body1">None</Typography>
            )}
            {killmails.data.length > 0 && (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Killer</TableCell>
                    <TableCell>Victim</TableCell>
                    <TableCell>Loss Type</TableCell>
                    <TableCell>Solar System</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {killmails.data.map((km) => {
                    const isoDate = ldapDate(km.timestamp).toISOString();
                    const date = isoDate.substring(0, 10);
                    const time = isoDate.substring(11, 19);
                    return (
                      <TableRow key={km.id}>
                        <TableCell>{`${date} ${time}`}</TableCell>
                        <TableCell>
                          <DisplayOwner
                            name={km.killerName}
                            address={km.killerAddress}
                          />
                        </TableCell>
                        <TableCell>
                          <DisplayOwner
                            name={km.victimName}
                            address={km.victimAddress}
                          />
                        </TableCell>
                        <TableCell>{km.lossType}</TableCell>
                        <TableCell>
                          <DisplaySolarsystem
                            solarSystemId={km.solarSystemId}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </PaperLevel1>
      <TableNamespaces address={address} />
      <TableTables namespaces={namespaces.map((ns) => ns.namespaceId)} />
      <TableSystems namespaces={namespaces.map((ns) => ns.namespaceId)} />
    </Box>
  );
};

export default ExploreCharacter;
