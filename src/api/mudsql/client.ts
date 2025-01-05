import { resourceToHex } from "@latticexyz/common";
import { client as restClient, postQ, PostQResponse } from "./generated/index";
import { indexerBaseUrl } from "@/constants";
import { createSchemasRepository } from "./schemasRepository";

restClient.setConfig({ baseUrl: indexerBaseUrl });

export type MudSqlClientConfig = {
  worldAddress: string;
};

function transformResult(
  data: PostQResponse["result"]
): Record<string, string>[] {
  const results = data.shift();
  const header = results?.shift();
  if (!results || !header) {
    return [];
  }
  return results.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, index) => {
      obj[key] = row[index];
    });
    return obj;
  });
}

function createClient() {
  let worldAddress: string = "";
  const schemas = createSchemasRepository();

  async function selectFrom<T extends object = Record<string, string>>(
    ns: string,
    table: string,
    where?: string
  ): Promise<T[]> {
    const tableId = resourceToHex({
      type: "table",
      namespace: ns,
      name: table,
    });

    const schema = await schemas.getTableSchema(tableId);
    const fields = Object.keys(schema.schema)
      .map((key) => `"${key}"`)
      .join(", ");

    let query = `SELECT ${fields} FROM ${ns}__${table}`;
    if (where) {
      query += ` WHERE ${where}`;
    }
    const r = await postQ({ body: [{ address: worldAddress, query }] });
    if (r.error) {
      throw new Error(r.error.msg);
    }
    return transformResult(r.data.result) as T[];
  }

  function setConfig(config: MudSqlClientConfig) {
    worldAddress = config.worldAddress;
  }

  return { selectFrom, setConfig };
}

export const client = createClient();
