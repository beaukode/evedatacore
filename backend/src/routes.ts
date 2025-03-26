import { Routing } from "express-zod-api";
import { calculatePath } from "./endpoints/calculatePath";

export const routes: Routing = {
  calc: { path: { ":from": { ":to": calculatePath } } },
};
