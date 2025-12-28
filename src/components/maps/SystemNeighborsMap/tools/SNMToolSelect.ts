import { takeEvery, put, all, debounce } from "typed-redux-saga";
import slice from "../Slice";

export const SNMToolSelectSaga = function* () {
  yield all([
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
    // Commit changes to DB backend
    debounce(500, slice.actions.updateSelectedNodeRecord, function* () {
      yield put(slice.actions.commitSelectedNodeRecord());
    }),
  ]);
};
