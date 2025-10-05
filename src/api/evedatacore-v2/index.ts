export * from "./generated";
import { client, GetCharacterIdLogbookResponse } from "./generated";

client.setConfig({
  baseUrl: "/api-v2",
});

export type LogBookRecord = GetCharacterIdLogbookResponse["items"][number];
