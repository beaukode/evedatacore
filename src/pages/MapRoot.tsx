import React from "react";
import { Box } from "@mui/material";
import { Provider } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import MapDrawer from "../map/MapDrawer";
import MapGraph from "../map/MapGraph";
import { GraphConnnection, GraphNode, SystemMap } from "@/map/common";
import { mapActions, getMapStore, MapStore } from "@/map/state";
import { useUserDataContext } from "@/contexts/UserDataContext";
import MapSearchField from "@/map/MapSearchField";

interface MapRootProps {
  systemId: string;
}

const MapRoot: React.FC<MapRootProps> = ({ systemId }) => {
  const [store, setStore] = React.useState<MapStore | undefined>(undefined);
  const { userDatabase } = useUserDataContext();

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
    const nodes: GraphNode[] = [];
    nodes.push(
      ...query.data.neighbors.map((neighbor) => ({
        id: neighbor.id,
        d: neighbor.distance,
        n: neighbor.n,
      }))
    );
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
    if (!store) {
      const store = getMapStore();
      setStore(store);
    }
  }, [store]);

  React.useEffect(() => {
    if (query.data.id !== "" && store) {
      store.dispatch(mapActions.init({ data: query.data, db: userDatabase }));
      return () => {
        store.dispatch(mapActions.dispose());
      };
    }
  }, [query.data, store, userDatabase]);

  if (!store) {
    return null;
  }

  return (
    <Provider store={store}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        <MapSearchField
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 200,
            zIndex: 1000,
          }}
        />
        <MapGraph
          nodes={nodes}
          connections={connections}
          onNodeClick={(node) => {
            store.dispatch(mapActions.onNodeClick(node.id));
          }}
          onNodeOver={(node) => {
            store.dispatch(mapActions.onNodeOver(node?.id));
          }}
        />
        <MapDrawer />
      </Box>
    </Provider>
  );
};

export default MapRoot;
