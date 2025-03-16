import { Routing } from "express-zod-api";
import { calculatePath } from "./endpoints/calculatePath";

export const routes: Routing = {
  api: {
    calc: { path: { ":from": { ":to": { ":jumpDistance": calculatePath } } } },
  },
};
