import React from "react";
import { Box, List, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ButtonCharacter from "./buttons/ButtonCharacter";
import ButtonAssembly from "./buttons/ButtonAssembly";
import ButtonSolarsystem from "./buttons/ButtonSolarsystem";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import { shorten, tsToDateTime } from "@/tools";
import { smartAssemblyStates } from "@/constants";
import useCanJump from "@/tools/useCanJump";
import ButtonWeb3Interaction from "./buttons/ButtonWeb3Interaction";
import ConditionalMount from "./ui/ConditionalMount";
import DialogGateLink from "./dialogs/DialogGateLink";
import { getAssemblyId } from "@/api/evedatacore-v2";

interface SmartGateLinkProps {
  sourceGateId: string;
  sourceGateState: number;
  linkedGateId?: string | null;
  owner: string;
}

const SmartGateLink: React.FC<SmartGateLinkProps> = ({
  sourceGateId,
  sourceGateState,
  linkedGateId,
  owner,
}) => {
  const [unlinkOpen, setUnlinkOpen] = React.useState(false);

  const query = useQuery({
    queryKey: ["SmartassembliesById", linkedGateId],
    queryFn: async () => {
      if (!linkedGateId) return null;
      const r = await getAssemblyId({ path: { id: linkedGateId } });
      if (!r.data) return null;
      return r.data;
    },
    enabled: !!linkedGateId,
  });

  const data = query.data;
  const destinationGateId = data?.id || "";
  const destinationGateState = data?.currentState || -1;

  const canJump = useCanJump(
    sourceGateId,
    sourceGateState,
    destinationGateId,
    destinationGateState
  );

  const { name, state } = React.useMemo(() => {
    if (!data) return { name: "..." };

    const state =
      smartAssemblyStates[
        data.currentState as keyof typeof smartAssemblyStates
      ] || "Unknown";
    return {
      name: `${data.name || shorten(data.id)}`,
      state,
    };
  }, [data]);

  return (
    <PaperLevel1 title="Destination" loading={query.isFetching}>
      {!data && !query.isFetching && (
        <Typography variant="body1">None</Typography>
      )}
      {data && (
        <>
          <ConditionalMount mount={unlinkOpen} keepMounted>
            <DialogGateLink
              open={unlinkOpen}
              sourceGateId={sourceGateId}
              destinationGateId={destinationGateId}
              owner={owner}
              action="unlink"
              onClose={() => {
                setUnlinkOpen(false);
                query.refetch();
              }}
            />
          </ConditionalMount>
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem
              title={
                <>
                  Gate
                  <ButtonWeb3Interaction
                    title="Unlink gates"
                    onClick={() => setUnlinkOpen(true)}
                  />
                </>
              }
              disableGutters
            >
              <ButtonAssembly id={data.id} name={name} />
            </BasicListItem>
            <BasicListItem title="Id">{data.id}</BasicListItem>
            <BasicListItem title="Owner" disableGutters>
              <ButtonCharacter address={data.account} name={data.ownerName} />
            </BasicListItem>
            <BasicListItem title="State">
              {state} [{data.currentState}]
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
            <BasicListItem title="Can you jump">
              {!canJump && (
                <Skeleton width={60} sx={{ display: "inline-block" }} />
              )}
              {canJump && (
                <>
                  {canJump.canJump === undefined &&
                    "Unknown (Connect your wallet)"}
                  {canJump.canJump === false && (
                    <Box component="span" sx={{ color: "warning.main" }}>
                      No ({canJump.message})
                    </Box>
                  )}
                  {canJump.canJump === true && "Yes"}
                </>
              )}
            </BasicListItem>
          </List>
        </>
      )}
    </PaperLevel1>
  );
};

export default SmartGateLink;
