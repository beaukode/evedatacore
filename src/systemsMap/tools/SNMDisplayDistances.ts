import { select, put, all, takeEvery } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import slice from "../Slice";
import { NodeAttributes } from "../common";

const MIN_OPACITY = 0.3;
const MAX_OPACITY = 1.0;

function createOpacityNormalizer(
  distances: number[]
): (distance: number) => number {
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const range = maxDistance - minDistance;
  return (distance: number) => {
    if (range === 0) {
      return 1.0;
    }
    // Normalize & invert
    const normalized = (distance - minDistance) / range;
    const inverted = 1 - normalized;
    // Scale
    return MIN_OPACITY + inverted * (MAX_OPACITY - MIN_OPACITY);
  };
}

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
    takeEvery(slice.actions.setSelectedNode, function* () {
      const selectedNode = yield* select(slice.selectors.selectSelectedNode);

      const normalizer = createOpacityNormalizer(
        data.neighbors
          .map((neighbor) => getDistance(neighbor.id, selectedNode || data.id))
          .concat(getDistance(data.id, selectedNode || data.id))
      );

      const nodes: NodeAttributes[] = data.neighbors.map((neighbor) => {
        const distance = getDistance(neighbor.id, selectedNode || data.id);
        const opacity = normalizer(distance);
        return {
          id: neighbor.id,
          name: neighbor.name,
          text: distance ? distance.toFixed(2) : "",
          opacity: opacity,
        };
      });
      const distance = getDistance(data.id, selectedNode || data.id);
      const opacity = normalizer(distance);
      nodes.push({
        id: data.id,
        name: data.name,
        text: distance ? distance.toFixed(2) : "",
        opacity: opacity,
      });
      yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
    }),
  ]);
};
