import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { SNMRootSaga } from "./Sagas";
import slice from "./Slice";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const SNMStore = configureStore({
  reducer: { map: slice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(SNMRootSaga);

export const SNMSelectors = slice.selectors;
export const SNMActions = slice.actions;

export type SNMState = ReturnType<typeof SNMStore.getState>;
export type SNMDispatch = typeof SNMStore.dispatch;

export const useSNMDispatch = useDispatch.withTypes<SNMDispatch>();
export const useSNMSelector = useSelector.withTypes<SNMState>();
