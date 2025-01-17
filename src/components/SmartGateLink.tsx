import React from "react";
import { Alert, Box, List, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMudSql } from "@/contexts/AppContext";
import ButtonCharacter from "./buttons/ButtonCharacter";
import ButtonAssembly from "./buttons/ButtonAssembly";
import ButtonSolarsystem from "./buttons/ButtonSolarsystem";
import PaperLevel1 from "./ui/PaperLevel1";
import BasicListItem from "./ui/BasicListItem";
import { shorten, tsToDateTime } from "@/tools";
import { smartAssemblyStates } from "@/constants";

interface SmartGateLinkProps {
  sourceGateId: string;
}

const SmartGateLink: React.FC<SmartGateLinkProps> = ({ sourceGateId }) => {
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["SmartGateLink", sourceGateId],
    queryFn: async () => mudSql.getGateLink(sourceGateId),
    enabled: !!sourceGateId,
  });

  const data = query.data;

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
          <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
            <BasicListItem title="Gate" disableGutters>
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
