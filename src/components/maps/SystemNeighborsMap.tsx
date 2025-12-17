import React from "react";
import { Box, Paper } from "@mui/material";
import { Provider } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import SystemNeighborsMapDrawer from "./SystemNeighborsMapDrawer";
import SystemNeighborsMapGraph from "./SystemNeighborsMapGraph";
import { GraphConnnection, GraphNode, SystemMap } from "./common";
import { SNMActions, SNMStore } from "./SystemNeighborsMap/Store";

interface SystemNeighborsMapProps {
  systemId: string;
}

const SystemNeighborsMap: React.FC<SystemNeighborsMapProps> = ({
  systemId,
}) => {
  const query = useQuery({
    queryKey: ["SystemNeighbors", systemId],
    queryFn: async () => {
      const r = await fetch(`/static/systems/${systemId}.json`);
      if (!r.ok) {
        throw new Error(`Failed to fetch system neighbors: ${r.statusText}`);
      }
      return r.json() as Promise<SystemMap>;
    },
    initialData: {
      id: "",
      name: "",
      location: ["0", "0", "0"],
      d_matrix: {},
      neighbors: [],
    },
  });

  const nodes: GraphNode[] = React.useMemo(() => {
    if (!query.data || query.data.id === "") {
      return [];
    }
    const nodes = query.data.neighbors.map((neighbor) => ({
      id: neighbor.id,
      d: neighbor.distance,
      n: neighbor.n,
    }));
    nodes.push({
      id: query.data?.id,
      d: 0,
      n: 0,
    });
    return nodes;
  }, [query.data]);

  const connections: GraphConnnection[] = React.useMemo(() => {
    if (!query.data) {
      return [];
    }
    const connectionsMap: Record<string, GraphConnnection> = {};
    if (query.data.gates) {
      for (const gate of query.data.gates) {
        const key = [query.data.id, gate].sort().join("-");
        connectionsMap[key] = {
          source: query.data.id,
          target: gate,
        };
      }
    }
    for (const neighbor of query.data.neighbors) {
      if (neighbor.gates) {
        for (const gate of neighbor.gates) {
          const key = [neighbor.id, gate].sort().join("-");
          connectionsMap[key] = {
            source: neighbor.id,
            target: gate,
          };
        }
      }
    }
    return Object.values(connectionsMap);
  }, [query.data]);

  React.useEffect(() => {
    if (query.data.id !== "") {
      SNMStore.dispatch(SNMActions.init({ data: query.data }));
    }
  }, [query.data]);

  return (
    <PaperLevel1
      title="Neighbouring systems"
      loading={query.isFetching}
      sx={{ p: 0 }}
    >
      <Provider store={SNMStore}>
        <Box
          sx={{
            width: "100%",
            height: "70vh",
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <SystemNeighborsMapGraph
            nodes={nodes}
            connections={connections}
            onNodeClick={(node) => {
              SNMStore.dispatch(SNMActions.onNodeClick(node.id));
            }}
            onNodeOver={(node) => {
              SNMStore.dispatch(SNMActions.onNodeOver(node?.id));
            }}
          />
          <Paper
            sx={{
              width: 200,
              flexShrink: 0,
              flexGrow: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            elevation={4}
          >
            <SystemNeighborsMapDrawer />
          </Paper>
        </Box>
      </Provider>
    </PaperLevel1>
  );
};

export default SystemNeighborsMap;
