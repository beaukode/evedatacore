import { takeEvery, select, put, fork, all } from "typed-redux-saga";
import { Saga, Task } from "redux-saga";
import slice from "./Slice";
import { SNMDisplayLPointsSaga } from "./tools/SNMDisplayLPoints";
import { SNMDisplayDistancesSaga } from "./tools/SNMDisplayDistances";
import { SNMDisplayPlanetsSaga } from "./tools/SNMDisplayPlanets";
import { SNMToolSelectSaga } from "./tools/SNMToolSelect";
import { DisplayKey, ToolKey } from "../common";

const displaySagas: Record<DisplayKey, Saga> = {
  distances: SNMDisplayDistancesSaga,
  lpoints: SNMDisplayLPointsSaga,
  planets: SNMDisplayPlanetsSaga,
};

const toolSagas: Record<ToolKey, Saga> = {
  select: SNMToolSelectSaga,
  routing: SNMToolSelectSaga,
};

export const SNMRootSaga = function* () {
  let displayTask: Task;
  let toolTask: Task;
  yield all([
    takeEvery(slice.actions.init, function* ({ payload }) {
      yield put(slice.actions.setDisplay("distances"));
      yield put(slice.actions.setTool("select"));
      yield put(
        slice.actions.setSelectedNode({
          prev: undefined,
          next: payload.data.id,
        })
      );
      yield put(slice.actions.setReady());
    }),
    takeEvery(slice.actions.setDisplay, function* ({ payload }) {
      displayTask?.cancel();
      displayTask = yield* fork(displaySagas[payload]);
    }),
    takeEvery(slice.actions.setTool, function* ({ payload }) {
      toolTask?.cancel();
      toolTask = yield* fork(toolSagas[payload]);
    }),
    takeEvery(slice.actions.onNodeOver, function* ({ payload }) {
      const prevOverNode = yield* select(slice.selectors.selectOverNode);
      if (prevOverNode !== payload) {
        yield put(
          slice.actions.setOverNode({ prev: prevOverNode, next: payload })
        );
      }
    }),
    takeEvery(slice.actions.onNodeClick, function* ({ payload }) {
      const prevSelectedNode = yield* select(
        slice.selectors.selectSelectedNode
      );
      if (prevSelectedNode !== payload) {
        yield put(
          slice.actions.setSelectedNode({
            prev: prevSelectedNode,
            next: payload,
          })
        );
      }
    }),
  ]);
};
