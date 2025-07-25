// This file is auto-generated by @hey-api/openapi-ts

import {
  createClient,
  createConfig,
  type OptionsLegacyParser,
} from "@hey-api/client-fetch";
import type {
  GetFindNearIdDistanceData,
  GetFindNearIdDistanceError,
  GetFindNearIdDistanceResponse,
  PostEventsData,
  PostEventsError,
  PostEventsResponse,
  GetCharactersData,
  GetCharactersError,
  GetCharactersResponse,
  GetCharacterIdTablesData,
  GetCharacterIdTablesError,
  GetCharacterIdTablesResponse,
  GetCharacterIdNamespacesData,
  GetCharacterIdNamespacesError,
  GetCharacterIdNamespacesResponse,
  GetCharacterIdAssembliesData,
  GetCharacterIdAssembliesError,
  GetCharacterIdAssembliesResponse,
  GetCharacterIdKillsData,
  GetCharacterIdKillsError,
  GetCharacterIdKillsResponse,
  GetCharacterIdSystemsData,
  GetCharacterIdSystemsError,
  GetCharacterIdSystemsResponse,
  GetCharacterIdFunctionsData,
  GetCharacterIdFunctionsError,
  GetCharacterIdFunctionsResponse,
  GetCharacterIdData,
  GetCharacterIdError,
  GetCharacterIdResponse,
  GetKillsData,
  GetKillsError,
  GetKillsResponse,
  GetTribeIdCharactersData,
  GetTribeIdCharactersError,
  GetTribeIdCharactersResponse,
  GetAssembliesTypeStateData,
  GetAssembliesTypeStateError,
  GetAssembliesTypeStateResponse,
  GetAssemblyIdNetworkData,
  GetAssemblyIdNetworkError,
  GetAssemblyIdNetworkResponse,
  GetAssemblyIdInventoriesData,
  GetAssemblyIdInventoriesError,
  GetAssemblyIdInventoriesResponse,
  GetAssemblyIdData,
  GetAssemblyIdError,
  GetAssemblyIdResponse,
  GetNamespacesData,
  GetNamespacesError,
  GetNamespacesResponse,
  GetNamespaceIdTablesData,
  GetNamespaceIdTablesError,
  GetNamespaceIdTablesResponse,
  GetNamespaceIdSystemsData,
  GetNamespaceIdSystemsError,
  GetNamespaceIdSystemsResponse,
  GetNamespaceIdFunctionsData,
  GetNamespaceIdFunctionsError,
  GetNamespaceIdFunctionsResponse,
  GetNamespaceIdData,
  GetNamespaceIdError,
  GetNamespaceIdResponse,
  GetSystemsData,
  GetSystemsError,
  GetSystemsResponse,
  GetSystemIdData,
  GetSystemIdError,
  GetSystemIdResponse,
  GetFunctionsData,
  GetFunctionsError,
  GetFunctionsResponse,
  GetFunctionIdData,
  GetFunctionIdError,
  GetFunctionIdResponse,
  GetTablesData,
  GetTablesError,
  GetTablesResponse,
  GetTableIdRecordsData,
  GetTableIdRecordsError,
  GetTableIdRecordsResponse,
  GetTableIdData,
  GetTableIdError,
  GetTableIdResponse,
  GetSolarsystemIdAssembliesData,
  GetSolarsystemIdAssembliesError,
  GetSolarsystemIdAssembliesResponse,
  GetSolarsystemIdKillsData,
  GetSolarsystemIdKillsError,
  GetSolarsystemIdKillsResponse,
} from "./types.gen";

export const client = createClient(createConfig());

export const getFindNearIdDistance = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetFindNearIdDistanceData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetFindNearIdDistanceResponse,
    GetFindNearIdDistanceError,
    ThrowOnError
  >({
    ...options,
    url: "/find/near/{id}/{distance}",
  });
};

export const postEvents = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<PostEventsData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    PostEventsResponse,
    PostEventsError,
    ThrowOnError
  >({
    ...options,
    url: "/events",
  });
};

export const getCharacters = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetCharactersData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharactersResponse,
    GetCharactersError,
    ThrowOnError
  >({
    ...options,
    url: "/characters",
  });
};

export const getCharacterIdTables = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdTablesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdTablesResponse,
    GetCharacterIdTablesError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/tables",
  });
};

export const getCharacterIdNamespaces = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdNamespacesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdNamespacesResponse,
    GetCharacterIdNamespacesError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/namespaces",
  });
};

export const getCharacterIdAssemblies = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdAssembliesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdAssembliesResponse,
    GetCharacterIdAssembliesError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/assemblies",
  });
};

export const getCharacterIdKills = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdKillsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdKillsResponse,
    GetCharacterIdKillsError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/kills",
  });
};

export const getCharacterIdSystems = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdSystemsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdSystemsResponse,
    GetCharacterIdSystemsError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/systems",
  });
};

export const getCharacterIdFunctions = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdFunctionsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdFunctionsResponse,
    GetCharacterIdFunctionsError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}/functions",
  });
};

export const getCharacterId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetCharacterIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetCharacterIdResponse,
    GetCharacterIdError,
    ThrowOnError
  >({
    ...options,
    url: "/character/{id}",
  });
};

export const getKills = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetKillsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetKillsResponse,
    GetKillsError,
    ThrowOnError
  >({
    ...options,
    url: "/kills",
  });
};

export const getTribeIdCharacters = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetTribeIdCharactersData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetTribeIdCharactersResponse,
    GetTribeIdCharactersError,
    ThrowOnError
  >({
    ...options,
    url: "/tribe/{id}/characters",
  });
};

export const getAssembliesTypeState = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetAssembliesTypeStateData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetAssembliesTypeStateResponse,
    GetAssembliesTypeStateError,
    ThrowOnError
  >({
    ...options,
    url: "/assemblies/{type}/{state}",
  });
};

export const getAssemblyIdNetwork = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetAssemblyIdNetworkData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetAssemblyIdNetworkResponse,
    GetAssemblyIdNetworkError,
    ThrowOnError
  >({
    ...options,
    url: "/assembly/{id}/network",
  });
};

export const getAssemblyIdInventories = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetAssemblyIdInventoriesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetAssemblyIdInventoriesResponse,
    GetAssemblyIdInventoriesError,
    ThrowOnError
  >({
    ...options,
    url: "/assembly/{id}/inventories",
  });
};

export const getAssemblyId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetAssemblyIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetAssemblyIdResponse,
    GetAssemblyIdError,
    ThrowOnError
  >({
    ...options,
    url: "/assembly/{id}",
  });
};

export const getNamespaces = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetNamespacesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetNamespacesResponse,
    GetNamespacesError,
    ThrowOnError
  >({
    ...options,
    url: "/namespaces",
  });
};

export const getNamespaceIdTables = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetNamespaceIdTablesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetNamespaceIdTablesResponse,
    GetNamespaceIdTablesError,
    ThrowOnError
  >({
    ...options,
    url: "/namespace/{id}/tables",
  });
};

export const getNamespaceIdSystems = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetNamespaceIdSystemsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetNamespaceIdSystemsResponse,
    GetNamespaceIdSystemsError,
    ThrowOnError
  >({
    ...options,
    url: "/namespace/{id}/systems",
  });
};

export const getNamespaceIdFunctions = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetNamespaceIdFunctionsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetNamespaceIdFunctionsResponse,
    GetNamespaceIdFunctionsError,
    ThrowOnError
  >({
    ...options,
    url: "/namespace/{id}/functions",
  });
};

export const getNamespaceId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetNamespaceIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetNamespaceIdResponse,
    GetNamespaceIdError,
    ThrowOnError
  >({
    ...options,
    url: "/namespace/{id}",
  });
};

export const getSystems = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetSystemsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetSystemsResponse,
    GetSystemsError,
    ThrowOnError
  >({
    ...options,
    url: "/systems",
  });
};

export const getSystemId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetSystemIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetSystemIdResponse,
    GetSystemIdError,
    ThrowOnError
  >({
    ...options,
    url: "/system/{id}",
  });
};

export const getFunctions = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetFunctionsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetFunctionsResponse,
    GetFunctionsError,
    ThrowOnError
  >({
    ...options,
    url: "/functions",
  });
};

export const getFunctionId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetFunctionIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetFunctionIdResponse,
    GetFunctionIdError,
    ThrowOnError
  >({
    ...options,
    url: "/function/{id}",
  });
};

export const getTables = <ThrowOnError extends boolean = false>(
  options?: OptionsLegacyParser<GetTablesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetTablesResponse,
    GetTablesError,
    ThrowOnError
  >({
    ...options,
    url: "/tables",
  });
};

export const getTableIdRecords = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetTableIdRecordsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetTableIdRecordsResponse,
    GetTableIdRecordsError,
    ThrowOnError
  >({
    ...options,
    url: "/table/{id}/records",
  });
};

export const getTableId = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetTableIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetTableIdResponse,
    GetTableIdError,
    ThrowOnError
  >({
    ...options,
    url: "/table/{id}",
  });
};

export const getSolarsystemIdAssemblies = <
  ThrowOnError extends boolean = false,
>(
  options: OptionsLegacyParser<GetSolarsystemIdAssembliesData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetSolarsystemIdAssembliesResponse,
    GetSolarsystemIdAssembliesError,
    ThrowOnError
  >({
    ...options,
    url: "/solarsystem/{id}/assemblies",
  });
};

export const getSolarsystemIdKills = <ThrowOnError extends boolean = false>(
  options: OptionsLegacyParser<GetSolarsystemIdKillsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    GetSolarsystemIdKillsResponse,
    GetSolarsystemIdKillsError,
    ThrowOnError
  >({
    ...options,
    url: "/solarsystem/{id}/kills",
  });
};
