import {
  takeEvery,
  select,
  put,
  fork,
  all,
  call,
  take,
  debounce,
} from "typed-redux-saga";
import { Saga, Task, eventChannel } from "redux-saga";
import { keyBy } from "lodash-es";
import { liveQuery } from "dexie";
import { SystemRecord } from "@/api/userdata";
import { sagaDisplayLPoints } from "./tools/DisplayLPoints";
import { sagaDisplayDistances } from "./tools/DisplayDistances";
import { sagaDisplayPlanets } from "./tools/DisplayPlanets";
import { sagaToolSelect } from "./tools/ToolSelect";
import { DisplayKey, NodeAttributes, ToolKey } from "../common";
import { mapActions, mapSelectors } from ".";

const displaySagas: Record<DisplayKey, Saga> = {
  distances: sagaDisplayDistances,
  lpoints: sagaDisplayLPoints,
  planets: sagaDisplayPlanets,
};

const toolSagas: Record<ToolKey, Saga> = {
  select: sagaToolSelect,
  routing: sagaToolSelect,
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
  const db = yield* select(mapSelectors.selectDb);
  const query = () => db.listSystemsByIds(ids);
  const liveQueryChannel = yield* call(createLiveQueryChannel, query);
  let initialHydration = true;

  try {
    while (true) {
      const records = yield* take(liveQueryChannel);
      if (initialHydration) {
        yield put(mapActions.setDbRecords(keyBy(records, "id")));
        initialHydration = false;
      } else {
        yield put(mapActions.updateDbRecords(keyBy(records, "id")));
      }
    }
  } finally {
    liveQueryChannel.close();
  }
}

export const sagaMapRoot = function* () {
  let displayTask: Task;
  let toolTask: Task;
  let watchSystemsTask: Task;
  yield all([
    takeEvery(mapActions.init, function* ({ payload: { data } }) {
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
      yield put(mapActions.setNodesAttributes(keyBy(nodes, "id")));

      watchSystemsTask = yield* fork(
        watchSystems,
        nodes.map((node) => node.id)
      );

      yield put(mapActions.setDisplay("distances"));
      yield put(mapActions.setTool("select"));
      yield* take(mapActions.setDbRecords);
      yield put(
        mapActions.setSelectedNode({
          prev: undefined,
          next: data.id,
        })
      );
      yield put(mapActions.setReady());
    }),
    takeEvery(mapActions.dispose, () => {
      watchSystemsTask?.cancel();
      displayTask?.cancel();
      toolTask?.cancel();
    }),
    takeEvery(mapActions.setDisplay, function* ({ payload }) {
      displayTask?.cancel();
      displayTask = yield* fork(displaySagas[payload]);
    }),
    takeEvery(mapActions.setTool, function* ({ payload }) {
      toolTask?.cancel();
      toolTask = yield* fork(toolSagas[payload]);
    }),
    takeEvery(mapActions.onNodeOver, function* ({ payload }) {
      const prevOverNode = yield* select(mapSelectors.selectOverNode);
      if (prevOverNode !== payload) {
        yield put(
          mapActions.setOverNode({ prev: prevOverNode, next: payload })
        );
      }
    }),
    takeEvery(mapActions.onNodeClick, function* ({ payload }) {
      const prevSelectedNode = yield* select(mapSelectors.selectSelectedNode);
      if (prevSelectedNode !== payload) {
        // Flush potential changes to DB backend before setting the new selected node
        yield put(mapActions.commitSelectedNodeRecord());
        yield put(
          mapActions.setSelectedNode({
            prev: prevSelectedNode,
            next: payload,
          })
        );
      }
    }),
    takeEvery(mapActions.commitSelectedNodeRecord, function* () {
      const db = yield* select(mapSelectors.selectDb);
      const selectedNodeRecord = yield* select(
        mapSelectors.selectSelectedNodeRecord
      );
      const selectedNodeDirty = yield* select(
        mapSelectors.selectSelectedNodeDirty
      );
      if (selectedNodeDirty && selectedNodeRecord) {
        yield* call(db.updateSystem, selectedNodeRecord);
      }
      yield put(mapActions.setSelectedNodeDirty(false));
    }),
    debounce(100, mapActions.setSearch, function* () {
      const search = yield* select(mapSelectors.selectSearch);
      const nodes = yield* select(mapSelectors.selectNodesAttributes);
      const allNodes = Object.values(nodes);
      const updatedNodes = allNodes
        .map((node) => {
          if (search.length > 1 && node.name.toUpperCase().includes(search)) {
            return { ...node, highlighted: true };
          } else if (node.highlighted) {
            return { ...node, highlighted: false };
          }
        })
        .filter((node) => node !== undefined);
      if (updatedNodes.length > 0) {
        yield put(mapActions.setNodesAttributes(keyBy(updatedNodes, "id")));
      }
    }),
  ]);
};
