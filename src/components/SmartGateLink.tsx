import React from "react";
import { Alert, Box, List, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
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

interface SmartGateLinkProps {
  sourceGateId: string;
  sourceGateState: number;
  owner: string;
}

const SmartGateLink: React.FC<SmartGateLinkProps> = ({
  sourceGateId,
  sourceGateState,
  owner,
}) => {
  const [unlinkOpen, setUnlinkOpen] = React.useState(false);
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartGateLink", sourceGateId],
    queryFn: async () =>
      mudSql.getGateLink(sourceGateId).then((r) => r || null), // useQuery complains if we return undefined
  });

  const data = query.data;
  const destinationGateId = data?.id || "";
  const destinationGateState = data?.state || -1;

  const canJump = useCanJump(
    sourceGateId,
    sourceGateState,
    destinationGateId,
    destinationGateState
  );

  const { name, state } = React.useMemo(() => {
    if (!data) return { name: "..." };

    const state =
      smartAssemblyStates[data.state as keyof typeof smartAssemblyStates] ||
      "Unknown";
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
              <ButtonCharacter address={data.ownerId} name={data.ownerName} />
            </BasicListItem>
            <BasicListItem title="State">
              {state} [{data.state}]
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
            <BasicListItem title="Is link active" disableGutters>
              {data.isLinked ? "Yes" : "No"}
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
          {!data.isLinked && (
            <Alert severity="warning">
              The link exists in the SmartGateLinkTab MUD table, but is set to
              false
            </Alert>
          )}
        </>
      )}
    </PaperLevel1>
  );
};

export default SmartGateLink;
