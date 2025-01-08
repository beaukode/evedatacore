import { SelectOptions, TableType } from "../types";

type SelectedTable = { ns: string; table: string; type?: TableType };

export function listSelectedTables(
  ns: string,
  table: string,
  options: SelectOptions
): Record<string, SelectedTable> {
  const tablesMap: Record<string, SelectedTable> = {
    [`${ns}__${table}`]: { ns, table, type: options.tableType },
  };

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
