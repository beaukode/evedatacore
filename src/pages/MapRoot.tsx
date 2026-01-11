import React from "react";
import { Box } from "@mui/material";
import { Provider } from "react-redux";
import MapDrawer from "@/map/MapDrawer";
import MapGraph from "@/map/MapGraph";
import { mapActions, getMapStore, MapStore } from "@/map/state";
import { useUserDataContext } from "@/contexts/UserDataContext";
import MapSearchField from "@/map/MapSearchField";
import MapProjectionSelect from "@/map/MapProjectionSelect";

interface MapRootProps {
  systemId: string;
}

const MapRoot: React.FC<MapRootProps> = ({ systemId }) => {
  const [store, setStore] = React.useState<MapStore | undefined>(undefined);
  const { userDatabase } = useUserDataContext();

  React.useEffect(() => {
    if (!store) {
      const store = getMapStore();
      setStore(store);
    }
  }, [store]);

  React.useEffect(() => {
    if (store) {
      store.dispatch(mapActions.init({ db: userDatabase, systemId }));
      return () => {
        store.dispatch(mapActions.dispose());
      };
    }
  }, [store, userDatabase, systemId]);

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
        <MapProjectionSelect
          sx={{
            position: "absolute",
            top: 12,
            right: 312,
            width: 200,
            zIndex: 1000,
          }}
        />
        <MapGraph
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
