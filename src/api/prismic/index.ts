import { createClient } from "@prismicio/client";
export * from "./generated/types.generated";

const client = createClient("evedatacore");

export async function getPage(uid: string) {
  return client.getByUID("page", uid);
}
