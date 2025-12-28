import {
  takeEvery,
  select,
  put,
  fork,
  all,
  call,
  take,
} from "typed-redux-saga";
import { Saga, Task, eventChannel } from "redux-saga";
import slice from "./Slice";
import { SNMDisplayLPointsSaga } from "./tools/SNMDisplayLPoints";
import { SNMDisplayDistancesSaga } from "./tools/SNMDisplayDistances";
import { SNMDisplayPlanetsSaga } from "./tools/SNMDisplayPlanets";
import { SNMToolSelectSaga } from "./tools/SNMToolSelect";
import { DisplayKey, NodeAttributes, ToolKey } from "../common";
import { db, SystemRecord, updateSystem } from "./Database";
import { keyBy } from "lodash-es";
import { liveQuery } from "dexie";

const displaySagas: Record<DisplayKey, Saga> = {
  distances: SNMDisplayDistancesSaga,
  lpoints: SNMDisplayLPointsSaga,
  planets: SNMDisplayPlanetsSaga,
};

const toolSagas: Record<ToolKey, Saga> = {
  select: SNMToolSelectSaga,
  routing: SNMToolSelectSaga,
};

function createLiveQueryChannel(query: () => Promise<SystemRecord[]>) {
  return eventChannel((emit) => {
    const subscription = liveQuery(query).subscribe({
      next: (data) => emit(data),
      error: (err) => console.error("liveQuery error:", err),
    });

    return () => {
      subscription.unsubscribe();
    };
  });
}

function* watchSystems(ids: string[]) {
  const query = () => db.systems.where("id").anyOf(ids).toArray();
  const liveQueryChannel = yield* call(createLiveQueryChannel, query);
  let initialHydration = true;

  try {
    while (true) {
      const records = yield* take(liveQueryChannel);
      if (initialHydration) {
        yield put(slice.actions.setDbRecords(keyBy(records, "id")));
        initialHydration = false;
      } else {
        yield put(slice.actions.updateDbRecords(keyBy(records, "id")));
      }
    }
  } finally {
    liveQueryChannel.close();
  }
}

export const SNMRootSaga = function* () {
  let displayTask: Task;
  let toolTask: Task;
  let watchSystemsTask: Task;
  yield all([
    takeEvery(slice.actions.init, function* ({ payload: { data } }) {
      // Initialize nodes attributes
      const nodes: NodeAttributes[] = data.neighbors.map((neighbor) => {
        return {
          id: neighbor.id,
          name: neighbor.name,
          text: "",
        };
      });
      nodes.push({
        id: data.id,
        name: data.name,
        text: "",
      });
      yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));

      watchSystemsTask = yield* fork(
        watchSystems,
        nodes.map((node) => node.id)
      );

      yield put(slice.actions.setDisplay("distances"));
      yield put(slice.actions.setTool("select"));
      yield put(
        slice.actions.setSelectedNode({
          prev: undefined,
          next: data.id,
        })
      );
      yield put(slice.actions.setReady());
    }),
    takeEvery(slice.actions.dispose, () => {
      watchSystemsTask?.cancel();
      displayTask?.cancel();
      toolTask?.cancel();
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
        // Flush potential changes to DB backend before setting the new selected node
        yield put(slice.actions.commitSelectedNodeRecord());
        yield put(
          slice.actions.setSelectedNode({
            prev: prevSelectedNode,
            next: payload,
          })
        );
      }
    }),
    takeEvery(slice.actions.commitSelectedNodeRecord, function* () {
      const selectedNodeRecord = yield* select(
        slice.selectors.selectSelectedNodeRecord
      );
      const selectedNodeDirty = yield* select(
        slice.selectors.selectSelectedNodeDirty
      );
      if (selectedNodeDirty && selectedNodeRecord) {
        yield* call(updateSystem, selectedNodeRecord);
      }
      yield put(slice.actions.setSelectedNodeDirty(false));
    }),
  ]);
};
