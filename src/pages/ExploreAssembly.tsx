import React from "react";
import { Hex } from "viem";
import { Helmet } from "react-helmet";
import { Box, Link, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { shorten, tsToDateTime } from "@/tools";
import { assemblyTypeMap } from "@/api/mudsql";
import ButtonSolarsystem from "@/components/buttons/ButtonSolarsystem";
import ButtonCharacter from "@/components/buttons/ButtonCharacter";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import BasicListItem from "@/components/ui/BasicListItem";
import { smartAssembliesTypes, smartAssemblyStates } from "@/constants";
import SmartGateLink from "@/components/SmartGateLink";
import SmartStorageInventory from "@/components/SmartStorageInventory";
import DialogOnOffAssembly from "@/components/dialogs/DialogOnOffAssembly";
import ButtonWeb3Interaction from "@/components/buttons/ButtonWeb3Interaction";
import DialogMetadataAssembly from "@/components/dialogs/DialogMetadataAssembly";
import ConditionalMount from "@/components/ui/ConditionalMount";
import SmartGateOther from "@/components/SmartGateOther";
import NetworkNode from "@/components/NetworkNode";
import AssemblyBehavior from "@/components/AssemblyBehavior";
import { getAssemblyId } from "@/api/evedatacore-v2";
import Error404 from "./Error404";

const ExploreAssembly: React.FC = () => {
  const { id } = useParams();
  const [metadataOpen, setMetadataOpen] = React.useState(false);
  const [onOffOpen, setOnOffOpen] = React.useState(false);

  const query = useQuery({
    queryKey: ["SmartassembliesById", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getAssemblyId({ path: { id } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!id,
  });

  const data = query.data;

  const { name, state, owner } = React.useMemo(() => {
    if (!data) return { name: "...", owner: "0x0" as Hex };
    const typeId =
      assemblyTypeMap[data.assemblyType as keyof typeof assemblyTypeMap];
    const type = smartAssembliesTypes[typeId] || "Unknown";
    const state =
      smartAssemblyStates[
        data.currentState as keyof typeof smartAssemblyStates
      ] || "Unknown";
    const owner = (data.account ?? "0x0") as Hex;
    return {
      name: `${data.name || shorten(data.id)} [${type}]`,
      state,
      owner,
    };
  }, [data]);

  if (!id || (!query.isLoading && !query.data)) {
    return <Error404 />;
  }

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
              owner={owner}
              title={`Edit ${name}`}
              onClose={() => {
                query.refetch();
                setMetadataOpen(false);
              }}
            />
          </ConditionalMount>
          <ConditionalMount mount={onOffOpen} keepMounted>
            <DialogOnOffAssembly
              open={onOffOpen}
              assemblyId={data.id}
              owner={owner}
              title={`Edit ${name}`}
              onClose={() => {
                query.refetch();
                setOnOffOpen(false);
              }}
            />
          </ConditionalMount>
        </>
      )}
      <PaperLevel1 title={name} loading={query.isFetching} backButton>
        {data && (
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Id">{data.id}</BasicListItem>
            <BasicListItem title="Item ID">
              {data.itemId} [{data.typeId}]
            </BasicListItem>
            <BasicListItem title="Owner" disableGutters>
              <ButtonCharacter address={owner} name={data.ownerName} />
            </BasicListItem>
            <BasicListItem
              title={
                <>
                  State
                  {[2, 3].includes(data.currentState ?? 0) && (
                    <ButtonWeb3Interaction
                      title="Edit assembly state"
                      onClick={() => setOnOffOpen(true)}
                    />
                  )}
                </>
              }
            >
              {state} [{data.currentState}]{" "}
            </BasicListItem>
            <BasicListItem title="Anchored at">
              {tsToDateTime(data.anchoredAt)}
            </BasicListItem>
            <BasicListItem title="Solar system" disableGutters>
              <ButtonSolarsystem solarSystemId={data.solarSystemId} />
            </BasicListItem>
            <BasicListItem title="Location">
              <Box sx={{ pl: 4 }}>
                <span style={{ textWrap: "nowrap" }}>x: {data.x}</span>{" "}
                <span style={{ textWrap: "nowrap" }}>y: {data.y}</span>{" "}
                <span style={{ textWrap: "nowrap" }}>z: {data.z}</span>
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
              {data.dappURL ? (
                <Link
                  href={data.dappURL}
                  title={name}
                  rel="noopener"
                  target="_blank"
                >
                  {data.dappURL}
                </Link>
              ) : (
                ""
              )}
            </BasicListItem>
          </List>
        )}
      </PaperLevel1>
      {data && (
        <>
          {data.assemblyType === "SG" && (
            <AssemblyBehavior
              systemId={data.systemId}
              assemblyId={id}
              owner={owner}
              type="gate"
              onChange={() => query.refetch()}
            />
          )}
          {data.assemblyType === "SG" && (
            <SmartGateLink
              sourceGateId={id}
              linkedGateId={data.linkedGateId}
              owner={owner}
              sourceGateState={data.currentState ?? 0}
            />
          )}
          {data.assemblyType === "SG" && (
            <SmartGateOther
              currentGateId={id}
              owner={owner}
              currentGateLocation={{
                x: data?.x ?? "0",
                y: data?.y ?? "0",
                z: data?.z ?? "0",
              }}
            />
          )}
          {data.assemblyType === "ST" && (
            <AssemblyBehavior
              systemId={data.systemId}
              assemblyId={id}
              owner={owner}
              type="turret"
              onChange={() => query.refetch()}
            />
          )}
          {data.assemblyType === "SSU" && (
            <SmartStorageInventory id={id} owner={owner} />
          )}
          {data.assemblyType === "NWN" && <NetworkNode id={id} />}
          {data.assemblyType !== "NWN" && data?.networkNodeId && (
            <NetworkNode id={data.networkNodeId} />
          )}
        </>
      )}
    </Box>
  );
};

export default ExploreAssembly;
