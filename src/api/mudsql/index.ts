import { worldAddress } from "@/constants";
import { createClient } from "./client";
export * from "./queries";
export * from "./types";

export const client = createClient();

client.setConfig({ worldAddress });
