export * from "./generated";
import {
  client,
  getConfig as orgGetConfig,
  GetConfigResponse,
  getTypes as orgGetTypes,
  types_AllTypesData,
} from "./generated";

client.setConfig({
  baseUrl: "/api-stillness",
});

type FixedGetConfigResponse = GetConfigResponse[];

export async function getConfig(...args: Parameters<typeof orgGetConfig>) {
  const r = await orgGetConfig(...args);
  return { ...r, data: r.data as unknown as FixedGetConfigResponse };
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
