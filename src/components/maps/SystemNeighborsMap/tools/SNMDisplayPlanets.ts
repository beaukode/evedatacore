import { select, put } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import slice from "../Slice";
import { NodeAttributes } from "../../common";

export const SNMDisplayPlanetsSaga = function* () {
  const data = yield* select(slice.selectors.selectData);
  const nodes: Partial<NodeAttributes>[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    text: "2P 3M",
  }));
  nodes.push({
    id: data.id,
    text: "3P 10M",
  });
  yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
};
