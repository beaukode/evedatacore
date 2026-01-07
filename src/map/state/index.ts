import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { sagaMapRoot } from "./sagas";
import { slice } from "./slice";

export type MapStore = ReturnType<typeof createMapStore>;
let store: MapStore | undefined = undefined;

function createMapStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = configureStore({
    reducer: { map: slice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ["map.db"],
          ignoredActionPaths: ["payload.db"],
        },
      }).concat(middleware),
  });
  sagaMiddleware.run(sagaMapRoot);
  return store;
}

export function getMapStore() {
  if (store) {
    return store;
  }

  store = createMapStore();

  return store;
}

export const mapSelectors = slice.selectors;
export const mapActions = slice.actions;

export type MapState = ReturnType<MapStore["getState"]>;
export type MapDispatch = MapStore["dispatch"];

export const useMapDispatch = useDispatch.withTypes<MapDispatch>();
export const useMapSelector = useSelector.withTypes<MapState>();
