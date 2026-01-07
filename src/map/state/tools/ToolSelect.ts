import { takeEvery, put, all, debounce } from "typed-redux-saga";
import { mapActions } from "../";

export const sagaToolSelect = function* () {
  yield all([
    takeEvery(mapActions.setSelectedNode, function* ({ payload }) {
      if (payload.next) {
        yield put(
          mapActions.setNodeAttributes({
            id: payload.next,
            attributes: { sx: { borderStyle: "dashed" } },
          })
        );
      }
      if (payload.prev) {
        yield put(
          mapActions.setNodeAttributes({
            id: payload.prev,
            attributes: { sx: { borderStyle: "solid" } },
          })
        );
      }
    }),
    // Commit changes to DB backend
    debounce(500, mapActions.updateSelectedNodeRecord, function* () {
      yield put(mapActions.commitSelectedNodeRecord());
    }),
  ]);
};
