import { Routing } from "express-zod-api";
import { calculatePath } from "./endpoints/calculatePath";
import { events } from "./endpoints/events";

export const routes: Routing = {
  calc: { path: { ":from": { ":to": calculatePath } } },
  events,
};
