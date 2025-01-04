export * from "./generated";
import {
  client,
  getSmartcharacters as orgGetSmartcharacters,
  getConfig as orgGetConfig,
  GetConfigResponse,
  getSolarsystems as orgGetSolarsystems,
  types_SolarSystem,
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

type FixedGetConfigResponse = GetConfigResponse[];

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

export async function getSmartcharacters(
  ...args: Parameters<typeof orgGetSmartcharacters>
) {
  const r = await orgGetSmartcharacters(...args);
  return { ...r, data: r.data as unknown as FixedGetSmartcharactersResponse[] };
}

export async function getConfig(...args: Parameters<typeof orgGetConfig>) {
  const r = await orgGetConfig(...args);
  return { ...r, data: r.data as unknown as FixedGetConfigResponse };
}

export async function getSolarsystems(
  ...args: Parameters<typeof orgGetSolarsystems>
) {
  const r = await orgGetSolarsystems(...args);
  return { ...r, data: r.data as unknown as FixedGetSolarsystemsResponse };
}
