import { select, put, all, takeEvery } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import slice from "../Slice";
import { NodeAttributes } from "../common";

export const SNMDisplayDistancesSaga = function* () {
  const data = yield* select(slice.selectors.selectData);

  const getDistance = (aId: string, bId: string): number => {
    return (
      data.d_matrix[`${aId}-${bId}`] ?? data.d_matrix[`${bId}-${aId}`] ?? 0
    );
  };

  const nodes: Partial<NodeAttributes>[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    text: neighbor.distance.toFixed(2),
  }));

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
  ]);
};
