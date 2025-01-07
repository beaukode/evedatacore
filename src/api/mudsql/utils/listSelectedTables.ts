import { SelectOptions } from "../types";

export function listSelectedTables(
  ns: string,
  table: string,
  options: SelectOptions
): Record<string, { ns: string; table: string }> {
  const tablesMap = { [`${ns}__${table}`]: { ns, table } };

  if (options.rels) {
    Object.values(options.rels).forEach((rel) => {
      tablesMap[`${rel.ns}__${rel.table}`] = { ns: rel.ns, table: rel.table };
      tablesMap[`${rel.fkNs}__${rel.fkTable}`] = {
        ns: rel.fkNs,
        table: rel.fkTable,
      };
    });
  }

  return tablesMap;
}
