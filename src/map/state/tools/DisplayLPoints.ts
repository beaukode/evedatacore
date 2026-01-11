import { select, put } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import { mapSelectors, mapActions } from "../";
import { NodeAttributes } from "../../common";

export const sagaDisplayLPoints = function* () {
  const data = yield* select(mapSelectors.selectSystemData);
  const nodes: Partial<NodeAttributes>[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    text: "0 / 10",
  }));
  nodes.push({
    id: data.id,
    text: "0 / 5",
  });
  yield put(mapActions.setNodesAttributes(keyBy(nodes, "id")));
};
