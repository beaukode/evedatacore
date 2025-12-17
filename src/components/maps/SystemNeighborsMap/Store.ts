import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { SNMRootSaga } from "./Sagas";
import slice from "./Slice";

export type SNMStore = ReturnType<typeof createSNMStore>;
let store: SNMStore | undefined = undefined;

function createSNMStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = configureStore({
    reducer: { map: slice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
  });
  sagaMiddleware.run(SNMRootSaga);
  return store;
}

export function getSNMStore() {
  if (store) {
    return store;
  }

  store = createSNMStore();

  return store;
}

export const SNMSelectors = slice.selectors;
export const SNMActions = slice.actions;

export type SNMState = ReturnType<SNMStore["getState"]>;
export type SNMDispatch = SNMStore["dispatch"];

export const useSNMDispatch = useDispatch.withTypes<SNMDispatch>();
export const useSNMSelector = useSelector.withTypes<SNMState>();
