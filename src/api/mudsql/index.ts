import { worldAddress } from "@/constants";
import { createClient } from "./client";
export * from "./queries/listNamespaces";
export * from "./types";

export const client = createClient();

client.setConfig({ worldAddress });
