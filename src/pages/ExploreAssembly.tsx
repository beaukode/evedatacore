import React from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getSmartassembliesById } from "@/api/stillness";
import { fuel, shorten } from "@/tools";
import DisplaySolarsystem from "@/components/DisplaySolarsystem";
import DisplayOwner from "@/components/DisplayOwner";
import SmartTurretProximity from "@/components/SmartTurretProximity";
import SmartGateLink from "@/components/SmartGateLink";
import SmartStorageUnitInventory from "@/components/SmartStorageUnitInventory";
import { fuelFactor } from "@/constants";
import Error404 from "./Error404";

const ExploreAssembly: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["SmartassembliesById", id],
    queryFn: async () =>
      await getSmartassembliesById({ path: { id: id || "0x" } }).then(
        (r) => r.data
      ),
    enabled: !!id,
  });

  const data = query.data;

  const { name, anchoredAt } = React.useMemo(() => {
    if (!data) return { name: "..." };
    return {
      name: `${data?.name || shorten(data?.id)} [${data?.assemblyType}]`,
      anchoredAt: new Date(
        Number.parseInt(data.anchoredAtTime, 10) * 1000
      ).toLocaleString(),
    };
  }, [data]);

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const fuelAmount = fuel(
    data?.fuel.fuelAmount || "0",
    data?.fuel.fuelUnitVolume || "0",
    fuelFactor
  );
  const fuelMaxCapacity = fuel(
    data?.fuel.fuelMaxCapacity || "0",
    data?.fuel.fuelUnitVolume || "0"
  );
  const fuelConsumption =
    Number.parseInt((data?.fuel.fuelConsumptionPerMin || "0") as string) /
    60 /
    60;

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      {!query.isLoading && data && (
        <Helmet>
          <title>{name}</title>
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
        {name}
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
                <ListItemText>Item Id: {data.itemId}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Type: {data.assemblyType} [{data.typeId}]
                </ListItemText>
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText>
                  Owner:{" "}
                  <DisplayOwner address={data.ownerId} name={data.ownerName} />
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  State: {data.state} [{data.stateId}]
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Anchored date: {anchoredAt}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Solar system:{" "}
                  {data.solarSystemId === 0 ? (
                    <>None</>
                  ) : (
                    <DisplaySolarsystem solarSystemId={data.solarSystemId} />
                  )}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Location:{" "}
                  <span style={{ textWrap: "nowrap" }}>
                    x: {data.location?.x}
                  </span>{" "}
                  <span style={{ textWrap: "nowrap" }}>
                    y: {data.location?.y}
                  </span>{" "}
                  <span style={{ textWrap: "nowrap" }}>
                    z: {data.location?.z}
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Description: {data.description}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Dapp Url:{" "}
                  {data.dappUrl ? (
                    <Link
                      href={data.dappUrl}
                      title={name}
                      rel="noopener"
                      target="_blank"
                    >
                      {data.dappUrl}
                    </Link>
                  ) : (
                    ""
                  )}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Fuel: {fuelAmount.toFixed(2)} / {fuelMaxCapacity}
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Fuel consumption: {fuelConsumption} per hour ? tbc
                </ListItemText>
              </ListItem>
            </List>
            <SmartTurretProximity proximity={data.proximity} />
          </Box>
        )}
      </Paper>
      {data && <SmartGateLink gateLink={data.gateLink} />}
      {data && <SmartStorageUnitInventory inventory={data.inventory} />}
    </Box>
  );
};

export default ExploreAssembly;
