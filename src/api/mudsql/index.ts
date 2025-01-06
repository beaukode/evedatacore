import { worldAddress } from "@/constants";
import { createClient } from "./client";
export * from "./queries/listNamespaces";

export const client = createClient();

client.setConfig({ worldAddress });
