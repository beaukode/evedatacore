import { takeEvery, select, put, fork, all } from "typed-redux-saga";
import { NodeAttributes } from "../common";
import slice from "./Slice";
import { keyBy } from "lodash-es";
import { Task } from "redux-saga";

const SNMDisplayDistancesSaga = function* () {
  const data = yield* select(slice.selectors.selectData);

  const getDistance = (aId: string, bId: string): number => {
    return (
      data.d_matrix[`${aId}-${bId}`] ?? data.d_matrix[`${bId}-${aId}`] ?? 0
    );
  };

  const nodes: NodeAttributes[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    name: neighbor.name,
    text: neighbor.distance.toFixed(2),
  }));
  nodes.push({
    id: data.id,
    name: data.name,
  });
  yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
  yield all([
    takeEvery(slice.actions.setOverNode, function* ({ payload }) {
      const selectedNode = yield* select(slice.selectors.selectSelectedNode);
      const nodes: NodeAttributes[] = data.neighbors.map((neighbor) => {
        const distance = getDistance(
          neighbor.id,
          payload.next || selectedNode || data.id
        );
        return {
          id: neighbor.id,
          name: neighbor.name,
          text: distance ? distance.toFixed(2) : "",
        };
      });
      const distance = getDistance(
        data.id,
        payload.next || selectedNode || data.id
      );
      nodes.push({
        id: data.id,
        name: data.name,
        text: distance ? distance.toFixed(2) : "",
      });
      yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
    }),
    takeEvery(slice.actions.setSelectedNode, function* ({ payload }) {
      if (payload.next) {
        yield put(
          slice.actions.setNodeAttributes({
            id: payload.next,
            attributes: { sx: { borderStyle: "dashed" } },
          })
        );
      }
      if (payload.prev) {
        yield put(
          slice.actions.setNodeAttributes({
            id: payload.prev,
            attributes: { sx: { borderStyle: "solid" } },
          })
        );
      }
    }),
  ]);
};

const SNMDisplayLPointsSaga = function* () {
  const data = yield* select(slice.selectors.selectData);
  const nodes: NodeAttributes[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    name: neighbor.name,
    text: "0 / 10",
  }));
  nodes.push({
    id: data.id,
    name: data.name,
    text: "0 / 5",
  });
  yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
};

export const SNMRootSaga = function* () {
  let task: Task;
  yield all([
    takeEvery(slice.actions.setDisplay, function* ({ payload }) {
      task?.cancel();
      if (payload === "distances") {
        task = yield* fork(SNMDisplayDistancesSaga);
      } else if (payload === "lpoints") {
        task = yield* fork(SNMDisplayLPointsSaga);
      }
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
