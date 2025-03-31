import * as events from "./actions/TableEvents";
import * as visitors from "./actions/TableVisitors";

export function createDb() {
  return {
    events,
    visitors,
  };
}
