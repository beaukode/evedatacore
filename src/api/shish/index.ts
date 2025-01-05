export * from "./generated";
import { client } from "./generated";

client.setConfig({
  baseUrl: "/api-shish",
});
