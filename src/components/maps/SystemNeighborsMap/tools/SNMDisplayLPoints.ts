import { select, put } from "typed-redux-saga";
import { keyBy } from "lodash-es";
import slice from "../Slice";
import { NodeAttributes } from "../../common";

export const SNMDisplayLPointsSaga = function* () {
  const data = yield* select(slice.selectors.selectData);
  const nodes: Partial<NodeAttributes>[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    text: "0 / 10",
  }));
  nodes.push({
    id: data.id,
    text: "0 / 5",
  });
  yield put(slice.actions.setNodesAttributes(keyBy(nodes, "id")));
};
