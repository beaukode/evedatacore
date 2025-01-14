import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import { getSmartcharactersById } from "@/api/stillness";
import { formatCrypto, ldapDate } from "@/tools";
import DisplaySolarsystem from "@/components/DisplaySolarsystem";
import DisplayAssembly from "@/components/DisplayAssembly";
import DisplayAssemblyIcon from "@/components/DisplayAssemblyIcon";
import DisplayOwner from "@/components/DisplayOwner";
import Error404 from "./Error404";
import TableNamespaces from "@/components/tables/TableNamespaces";
import TableTables from "@/components/tables/TableTables";
import TableSystems from "@/components/tables/TableSystems";

const ExploreCharacter: React.FC = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartcharactersById", address],
    queryFn: async () =>
      await getSmartcharactersById({ path: { id: address || "0x" } }).then(
        (r) => r.data
      ),
    enabled: !!address,
  });

  const killmails = useQuery({
    queryKey: ["Killmails", address],
    queryFn: async () => mudSql.listKillmails({ characterId: query.data?.id }),
    enabled: !!query.data?.id,
  });

  const queryNamespaces = useQuery({
    queryKey: ["Namespaces", address],
    queryFn: async () => mudSql.listNamespaces({ owners: address }),
  });

  const namespaces = queryNamespaces.data || [];

  if (!address || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const data = query.data;
  const smartAssemblies = data?.smartAssemblies || [];

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      {!query.isLoading && data && (
        <Helmet>
          <title>{data.name}</title>
        </Helmet>
      )}
      <Typography
        variant="h6"
        component="h2"
        sx={{ bgcolor: "background.default" }}
        gutterBottom
      >
        <IconButton color="primary" onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        {data?.name || "..."}
      </Typography>
      <Paper elevation={1} sx={{ mb: 2 }}>
        <LinearProgress
          sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
        />
        {!query.isLoading && data && (
          <Box>
            <List sx={{ width: "100%", overflow: "hidden" }}>
              <ListItem>
                <ListItemText>
                  <TextField
                    label="Id"
                    value={data.id}
                    variant="outlined"
                    onChange={() => {}}
                    fullWidth
                  />
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Address: {data.address}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Corporation Id: {data.corpId}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Eve balance: {formatCrypto(data.eveBalanceWei)}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Gas balance: {formatCrypto(data.gasBalanceWei)}
                </ListItemText>
              </ListItem>
            </List>
            <Box p={2}>
              <Typography variant="h5" component="h3" gutterBottom>
                Assemblies
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
      {!query.isLoading && data && (
        <>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            Assemblies
          </Typography>
          <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
            {smartAssemblies.length === 0 && (
              <Typography variant="body1">None</Typography>
            )}
            {smartAssemblies.length > 0 && (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Solar system</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {smartAssemblies.map((sa) => (
                    <TableRow key={sa.itemId}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DisplayAssemblyIcon
                            typeId={sa.typeId}
                            stateId={sa.stateId}
                            tooltip
                          />
                          <DisplayAssembly id={sa.id} name={sa.name} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {sa.stateId !== 1 && (
                          <DisplaySolarsystem
                            solarSystemId={sa.solarSystem?.solarSystemId}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </>
      )}
      {!killmails.isLoading && killmails.data && (
        <>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            Killmails
          </Typography>
          <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
            <LinearProgress
              sx={{ visibility: query.isFetching ? "visible" : "hidden" }}
            />
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
          </Paper>
        </>
      )}
      <TableNamespaces address={address} />
      <TableTables namespaces={namespaces.map((ns) => ns.namespaceId)} />
      <TableSystems namespaces={namespaces.map((ns) => ns.namespaceId)} />
    </Box>
  );
};

export default ExploreCharacter;
