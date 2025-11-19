export * from "./generated";
import {
  client,
  GetCharacterIdLogbookResponse,
  GetCharactersResponse,
  GetTribesResponse,
  GetAssembliesTypeStateResponse,
  GetKillsResponse,
  GetNamespacesResponse,
  GetTablesResponse,
  GetSystemsResponse,
  GetFunctionsResponse,
  GetSolarsystemsResponse,
} from "./generated";

client.setConfig({
  baseUrl: "/api-v2",
});

export type LogBookRecord = GetCharacterIdLogbookResponse["items"][number];
export type Tribe = GetTribesResponse["items"][number];
export type Character = GetCharactersResponse["items"][number];
export type Assembly = GetAssembliesTypeStateResponse["items"][number];
export type Kill = GetKillsResponse["items"][number];
export type Namespace = GetNamespacesResponse["items"][number];
export type Table = GetTablesResponse["items"][number];
export type System = GetSystemsResponse["items"][number];
export type Function = GetFunctionsResponse["items"][number];
export type SolarSystem = GetSolarsystemsResponse["items"][number];
