import { call, getContext } from "typed-redux-saga";
import { LastOptions, lastOptionsSchema } from "../../common";
import {
  createLocalStorageSagaContext,
  LocalStorageSagaContext,
} from "./localStorageSagaContext";

export const lastOptionsSagaContext = createLocalStorageSagaContext(
  "v2_map_last_options",
  lastOptionsSchema
);

export function* readLastOptionsSagaContext() {
  const context =
    yield* getContext<LocalStorageSagaContext<LastOptions>>("lastOptions");
  const value = yield* call(context.getValue);
  return value;
}

export function* updateLastOptionsSagaContext<P extends true | false = false>(
  value: P extends true ? Partial<LastOptions> : LastOptions,
  partial: P = false as P
) {
  const context =
    yield* getContext<LocalStorageSagaContext<LastOptions>>("lastOptions");
  yield* call(context.setValue, value, partial);
}
