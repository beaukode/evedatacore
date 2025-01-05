import { worldAddress } from "@/constants";
import { client } from "./client";
export * from "./queries/listNamespaces";

client.setConfig({ worldAddress });
