export * from "./generated";
import {
  client,
  GetCharacterIdLogbookResponse,
  GetCharactersResponse,
  GetTribesResponse,
  GetAssembliesTypeStateResponse,
  GetKillsResponse
} from "./generated";

client.setConfig({
  baseUrl: "/api-v2",
});

export type LogBookRecord = GetCharacterIdLogbookResponse["items"][number];
export type Tribe = GetTribesResponse["items"][number];
export type Character = GetCharactersResponse["items"][number];
export type Assembly = GetAssembliesTypeStateResponse["items"][number];
export type Kill = GetKillsResponse["items"][number];
