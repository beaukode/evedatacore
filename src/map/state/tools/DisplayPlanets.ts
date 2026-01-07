import { select, put } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import { mapSelectors, mapActions } from "../";
import { NodeAttributes } from "../../common";

export const sagaDisplayPlanets = function* () {
  const data = yield* select(mapSelectors.selectData);
  const nodes: Partial<NodeAttributes>[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    text: "2P 3M",
  }));
  nodes.push({
    id: data.id,
    text: "3P 10M",
  });
  yield put(mapActions.setNodesAttributes(keyBy(nodes, "id")));
};
