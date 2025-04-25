import React from "react";
import { Box, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import SolarsystemName from "@/components/ui/SolarsystemName";
import { useMudSql } from "@/contexts/AppContext";
import { shorten } from "@/tools";
import BasicListItem from "@/components/ui/BasicListItem";
import Error404 from "@/pages/Error404";
import { getGateConfig } from "./lib/getGateConfig";
import { isGateManaged } from "./lib/utils";
import Setup from "./components/Setup";
import ConfigEditor from "./components/ConfigEditor";

const Administrator: React.FC = () => {
  const { id } = useParams();
  const mudSql = useMudSql();

  const query = useQuery({
    queryKey: ["GatesDapp", "Smartgate", id],
    queryFn: async () => mudSql.getGate(id || ""),
    enabled: !!id,
  });

  const gate = query.data;

  const queryDestination = useQuery({
    queryKey: ["GatesDapp", "Smartgate", gate?.destinationId],
    queryFn: async () =>
      mudSql.getGate(gate?.destinationId || "").then((r) => r ?? null),
    enabled: !!gate?.destinationId,
  });

  const destination = queryDestination.data;

  const queryGateConfig = useQuery({
    queryKey: ["GatesDapp", "SmartgateConfig", id],
    queryFn: async () => getGateConfig(mudSql)(id || "").then((r) => r ?? null),
    enabled: !!id,
  });

  const config = queryGateConfig.data;

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
            {isGateManaged(gate) && config ? (
              <ConfigEditor gate={gate} />
            ) : (
              <Setup
                gate={gate}
                onSuccess={() => {
                  query.refetch();
                  queryGateConfig.refetch();
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
