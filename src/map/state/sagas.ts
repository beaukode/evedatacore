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
import { sagaProjectionCenter } from "./tools/ProjectionCenter";
import { sagaProjectionFlat } from "./tools/ProjectionFlat";
import { sagaDisplayLPoints } from "./tools/DisplayLPoints";
import { sagaDisplayDistances } from "./tools/DisplayDistances";
import { sagaDisplayPlanets } from "./tools/DisplayPlanets";
import { sagaToolSelect } from "./tools/ToolSelect";
import {
  MapProjection,
  MapDisplay,
  MapTool,
  NodeAttributes,
  SystemMap,
  GraphConnnection,
} from "../common";
import { mapActions, mapSelectors } from ".";

const projectionSagas: Record<MapProjection, Saga> = {
  center: sagaProjectionCenter,
  flat: sagaProjectionFlat,
};

const displaySagas: Record<MapDisplay, Saga> = {
  distances: sagaDisplayDistances,
  lpoints: sagaDisplayLPoints,
  planets: sagaDisplayPlanets,
};

const toolSagas: Record<MapTool, Saga> = {
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

async function fetchSystemData(systemId: string) {
  const r = await fetch(`/static/systems/${systemId}.json`);
  if (!r.ok) {
    throw new Error(`Failed to fetch system neighbors: ${r.statusText}`);
  }
  return r.json() as Promise<SystemMap>;
}

export const sagaMapRoot = function* () {
  let projectionTask: Task;
  let displayTask: Task;
  let toolTask: Task;
  let watchSystemsTask: Task;
  yield all([
    takeEvery(mapActions.init, function* ({ payload: { systemId } }) {
      const systemData = yield* call(fetchSystemData, systemId);

      const nodesAttributes: NodeAttributes[] = systemData.neighbors.map(
        (node) => {
          return {
            id: node.id,
            name: node.name,
            text: "",
          };
        }
      );
      nodesAttributes.push({
        id: systemData.id,
        name: systemData.name,
        text: "",
      });

      const connectionsMap: Record<string, GraphConnnection> = {};
      if (systemData.gates) {
        for (const gate of systemData.gates) {
          const key = [systemData.id, gate].sort().join("-");
          connectionsMap[key] = {
            source: systemData.id,
            target: gate,
          };
        }
      }
      for (const neighbor of systemData.neighbors) {
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
      const backgroundLayer = Object.values(connectionsMap);

      yield put(
        mapActions.initData({
          systemData,
          nodesAttributes: keyBy(nodesAttributes, "id"),
          backgroundLayer,
        })
      );
    }),
    takeEvery(
      mapActions.initData,
      function* ({ payload: { nodesAttributes } }) {
        const systemId = yield* select(mapSelectors.selectSystemId);

        watchSystemsTask = yield* fork(
          watchSystems,
          Object.keys(nodesAttributes)
        );

        yield put(mapActions.setProjection(MapProjection.Center));
        yield put(mapActions.setDisplay(MapDisplay.Distances));
        yield put(mapActions.setTool(MapTool.Select));
        yield* take(mapActions.setDbRecords); // Wait DB records hydration
        yield put(
          mapActions.setSelectedNode({
            prev: undefined,
            next: systemId,
          })
        );
        yield put(mapActions.setReady());
      }
    ),
    takeEvery(mapActions.dispose, () => {
      watchSystemsTask?.cancel();
      projectionTask?.cancel();
      displayTask?.cancel();
      toolTask?.cancel();
    }),
    takeEvery(mapActions.setProjection, function* ({ payload }) {
      projectionTask?.cancel();
      projectionTask = yield* fork(projectionSagas[payload]);
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
