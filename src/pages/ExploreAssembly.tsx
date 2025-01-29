import React from "react";
import { Helmet } from "react-helmet";
import { Box, Link, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useMudSql } from "@/contexts/AppContext";
import { fuel, shorten, tsToDateTime } from "@/tools";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import {
  fuelFactor,
  smartAssembliesTypes,
  smartAssemblyStates,
} from "@/constants";
import Error404 from "./Error404";
import SmartGateLink from "@/components/SmartGateLink";
import SmartStorageInventory from "@/components/SmartStorageInventory";
import SmartStorageUsersInventory from "@/components/SmartStorageUsersInventory";
import SmartGateConfig from "@/components/SmartGateConfig";
import SmartTurretConfig from "@/components/SmartTurretConfig";
import DialogOnOffAssembly from "@/components/dialogs/DialogOnOffAssembly";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";
import DialogMetadataAssembly from "@/components/dialogs/DialogMetadataAssembly";
import ConditionalMount from "@/components/ui/ConditionalMount";
import SmartGateOther from "@/components/SmartGateOther";

const ExploreAssembly: React.FC = () => {
  const { id } = useParams();
  const [metadataOpen, setMetadataOpen] = React.useState(false);
  const [onOffOpen, setOnOffOpen] = React.useState(false);

  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartassembliesById", id],
    queryFn: async () => mudSql.getAssembly(id || ""),
    enabled: !!id,
  });

  const queryFuel = useQuery({
    queryKey: ["SmartassembliesFuel", id],
    queryFn: async () => mudSql.getAssemblyFuel(id || ""),
    enabled: !!id,
  });

  const data = query.data;

  const refetch = React.useCallback(() => {
    query.refetch();
    queryFuel.refetch();
  }, [query, queryFuel]);

  const { name, type, state } = React.useMemo(() => {
    if (!data) return { name: "..." };
    const type =
      smartAssembliesTypes[data.typeId as keyof typeof smartAssembliesTypes] ||
      "Unknown";
    const state =
      smartAssemblyStates[data.state as keyof typeof smartAssemblyStates] ||
      "Unknown";
    return {
      name: `${data.name || shorten(data.id)} [${type}]`,
      type,
      state,
    };
  }, [data]);

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

  const fuelAmount = fuel(
    queryFuel.data?.fuelAmount || "0",
    queryFuel.data?.fuelUnitVolume || "0",
    fuelFactor
  );
  const fuelMaxCapacity = fuel(
    queryFuel.data?.fuelMaxCapacity || "0",
    queryFuel.data?.fuelUnitVolume || "0"
  );

  return (
    <Box p={2} flexGrow={1} overflow="auto">
      {data && (
        <>
          <Helmet>
            <title>{name}</title>
          </Helmet>
          <ConditionalMount mount={metadataOpen} keepMounted>
            <DialogMetadataAssembly
              open={metadataOpen}
              assemblyId={data.id}
              owner={data.ownerId}
              title={`Edit ${name}`}
              onClose={() => {
                setMetadataOpen(false);
                refetch();
              }}
            />
          </ConditionalMount>
          <ConditionalMount mount={onOffOpen} keepMounted>
            <DialogOnOffAssembly
              open={onOffOpen}
              assemblyId={data.id}
              owner={data.ownerId}
              title={`Edit ${name}`}
              onClose={() => {
                setOnOffOpen(false);
                refetch();
              }}
            />
          </ConditionalMount>
        </>
      )}
      <PaperLevel1 title={name} loading={query.isFetching} backButton>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Id">{data.id}</BasicListItem>
            <BasicListItem title="Type">
              {type} [{data.typeId}]
            </BasicListItem>
            <BasicListItem title="Owner" disableGutters>
              <ButtonCharacter address={data.ownerId} name={data.ownerName} />
            </BasicListItem>
            <BasicListItem
              title={
                <>
                  State
                  {[2, 3].includes(data.state) && (
                    <ButtonWeb3Interaction
                      title="Edit assembly state"
                      onClick={() => setOnOffOpen(true)}
                    />
                  )}
                </>
              }
            >
              {state} [{data.state}]{" "}
            </BasicListItem>
            <BasicListItem title="Anchored at">
              {tsToDateTime(data.anchoredAt)}
            </BasicListItem>
            <BasicListItem title="Solar system" disableGutters>
              <ButtonSolarsystem solarSystemId={data.solarSystemId} />
            </BasicListItem>
            <BasicListItem title="Location">
              <Box sx={{ pl: 4 }}>
                <span style={{ textWrap: "nowrap" }}>
                  x: {data.location?.x}
                </span>{" "}
                <span style={{ textWrap: "nowrap" }}>
                  y: {data.location?.y}
                </span>{" "}
                <span style={{ textWrap: "nowrap" }}>
                  z: {data.location?.z}
                </span>
              </Box>
            </BasicListItem>
            <BasicListItem
              title={
                <>
                  Name
                  <ButtonWeb3Interaction
                    title="Edit assembly metadata"
                    onClick={() => setMetadataOpen(true)}
                  />
                </>
              }
            >
              {data.name}
            </BasicListItem>
            <BasicListItem
              title={
                <>
                  Description
                  <ButtonWeb3Interaction
                    title="Edit assembly metadata"
                    onClick={() => setMetadataOpen(true)}
                  />
                </>
              }
            >
              {data.description?.trim() && (
                <Box sx={{ ml: 4, mt: 2, whiteSpace: "pre" }}>
                  {data.description}
                </Box>
              )}
            </BasicListItem>
            <BasicListItem
              title={
                <>
                  Dapp Url
                  <ButtonWeb3Interaction
                    title="Edit assembly metadata"
                    onClick={() => setMetadataOpen(true)}
                  />
                </>
              }
            >
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
            </BasicListItem>
            <BasicListItem title="Fuel">
              {fuelAmount.toFixed(2)} / {fuelMaxCapacity} (
              {((fuelAmount / fuelMaxCapacity) * 100).toFixed(2)}%)
            </BasicListItem>
          </List>
        )}
      </PaperLevel1>
      {data?.typeId === 84955 && <SmartGateConfig gateId={id} />}
      {data?.typeId === 84955 && <SmartGateLink sourceGateId={id} />}
      {data?.typeId === 84955 && (
        <SmartGateOther
          owner={data.ownerId}
          currentGateId={id}
          currentGateLocation={data.location}
        />
      )}
      {data?.typeId === 84556 && <SmartTurretConfig turretId={id} />}
      {data?.typeId === 77917 && <SmartStorageInventory id={id} />}
      {data?.typeId === 77917 && <SmartStorageUsersInventory id={id} />}
    </Box>
  );
};

export default ExploreAssembly;
