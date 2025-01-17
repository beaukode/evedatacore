export * from "./generated";
import {
  client,
  getSmartcharacters as orgGetSmartcharacters,
  getConfig as orgGetConfig,
  GetConfigResponse,
  getSolarsystems as orgGetSolarsystems,
  types_SolarSystem,
  getTypes as orgGetTypes,
  types_AllTypesData,
} from "./generated";

client.setConfig({
  baseUrl: "/api-stillness",
});

type FixedGetSmartcharactersResponse = {
  address: string;
  // Big int issue ?
  // id: unknown;
  name: string;
  image: string;
};

export async function getSmartcharacters(
  ...args: Parameters<typeof orgGetSmartcharacters>
) {
  const r = await orgGetSmartcharacters(...args);
  return { ...r, data: r.data as unknown as FixedGetSmartcharactersResponse[] };
}

type FixedGetConfigResponse = GetConfigResponse[];

export async function getConfig(...args: Parameters<typeof orgGetConfig>) {
  const r = await orgGetConfig(...args);
  return { ...r, data: r.data as unknown as FixedGetConfigResponse };
}

export type Location = {
  x: string;
  y: string;
  z: string;
};

export type SolarSystem = Omit<types_SolarSystem, "location"> & {
  location: Location;
};

export type FixedGetSolarsystemsResponse = {
  [key: string]: SolarSystem;
};

export async function getSolarsystems(
  ...args: Parameters<typeof orgGetSolarsystems>
) {
  const r = await orgGetSolarsystems(...args);
  return { ...r, data: r.data as unknown as FixedGetSolarsystemsResponse };
}

export type TypeAttribute = {
  trait_type: string;
  value: string | number;
};

export type Type = Omit<Required<types_AllTypesData>, "attributes"> & {
  image: string;
  attributes: TypeAttribute[];
};

export type FixedGetTypesResponse = {
  [key: string]: Type;
};

export async function getTypes(...args: Parameters<typeof orgGetTypes>) {
  const r = await orgGetTypes(...args);
  return { ...r, data: r.data as unknown as FixedGetTypesResponse };
}
