import React from "react";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import SolarsystemName from "@/components/ui/SolarsystemName";
import { shorten } from "@/tools";
import BasicListItem from "@/components/ui/BasicListItem";
import Error404 from "@/pages/Error404";
import { isGateManaged } from "./lib/utils";
import Setup from "./components/Setup";
import ConfigEditor from "./components/ConfigEditor";
import { getAssemblyId } from "@/api/evedatacore-v2";

const Administrator: React.FC = () => {
  const { id } = useParams();

  const query = useQuery({
    queryKey: ["GatesDapp", "Smartgate", id],
    queryFn: async () => {
      if (!id) return null;
      const r = await getAssemblyId({ path: { id } });
      if (!r.data || r.data.assemblyType !== "SG") return null;
      return r.data;
    },
    enabled: !!id,
  });

  const gate = query.data;

  const queryDestination = useQuery({
    queryKey: ["GatesDapp", "Smartgate", gate?.linkedGateId],
    queryFn: async () => {
      if (!gate?.linkedGateId) return null;
      const r = await getAssemblyId({ path: { id: gate.linkedGateId } });
      if (!r.data || r.data.assemblyType !== "SG") return null;
      return r.data;
    },
    enabled: !!gate?.linkedGateId,
  });

  const destination = queryDestination.data;

  const title = gate
    ? gate.name || shorten(gate.id) || "Gate not found"
    : "...";

  const isLoading = query.isLoading || queryDestination.isLoading;

  if (!gate && !isLoading) return <Error404 hideBackButton />;

  return (
    <Box m={2}>
      <PaperLevel1 title={title} loading={isLoading} backButton>
        {!isLoading && gate && (
          <>
            <List sx={{ width: "100%", overflow: "hidden" }} disablePadding>
              <BasicListItem title="Location">
                <SolarsystemName solarSystemId={gate.solarSystemId} inline />
              </BasicListItem>
              <BasicListItem title="Destination">
                {destination ? (
                  <>
                    <SolarsystemName
                      solarSystemId={destination.solarSystemId}
                      inline
                    />{" "}
                    ({destination.name || shorten(destination.id)})
                  </>
                ) : (
                  "None"
                )}
              </BasicListItem>
            </List>
            {isGateManaged(gate) && gate.datacoreGate ? (
              <ConfigEditor gate={gate} />
            ) : (
              <Setup
                gate={gate}
                onSuccess={() => {
                  query.refetch();
                }}
              />
            )}
          </>
        )}
      </PaperLevel1>
    </Box>
  );
};

export default Administrator;
