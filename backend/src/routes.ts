import { Routing } from "express-zod-api";
import { calculatePath } from "./endpoints/calculatePath";
import { findNear } from "./endpoints/findNear";
import { events } from "./endpoints/events";

export const routes: Routing = {
  calc: { path: { ":from": { ":to": calculatePath } } },
  find: { near: { ":id": { ":distance": findNear } } },
  events,
};
