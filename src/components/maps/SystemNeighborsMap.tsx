import React from "react";
import { Box, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import SystemNeighborsMapDrawer from "./SystemNeighborsMapDrawer";
import { GraphConnnection, GraphNode, SystemMap } from "./common";
import SystemNeighborsMapGraph from "./SystemNeighborsMapGraph";
import { useToolbox } from "./toolbox/useToolbox";

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

  const toolbox = useToolbox(query.data);

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

  return (
    <PaperLevel1
      title="Neighbouring systems"
      loading={query.isFetching}
      sx={{ p: 0 }}
    >
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
          nodesAttributes={toolbox.nodes}
          connections={connections}
          onNodeClick={(node) => {
            console.log("clicked node", node);
          }}
          onNodeOver={(node) => {
            toolbox.onNodeOver(node);
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
          <SystemNeighborsMapDrawer
            display={toolbox.display}
            onDisplayChange={toolbox.setDisplay}
            tool={toolbox.tool}
            onToolChange={toolbox.setTool}
          />
        </Paper>
      </Box>
    </PaperLevel1>
  );
};

export default SystemNeighborsMap;
