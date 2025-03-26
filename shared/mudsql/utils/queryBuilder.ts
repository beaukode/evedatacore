import { Schema } from "@latticexyz/config";
import { SelectOptions } from "../types";
import { listSelectedTables } from "./listSelectedTables";
import { ensureArray } from ".";

export function queryBuilder(
  ns: string,
  table: string,
  options: SelectOptions,
  schemas: Record<string, Schema>
): string {
  const mainTable = `${ns}__${table}`;
  const tables = listSelectedTables(ns, table, options);

  // Check needed schemas are available
  const missingSchemas = Object.keys(tables).filter((table) => !schemas[table]);
  if (missingSchemas.length > 0) {
    throw new Error(`Missing schemas for tables: ${missingSchemas.join(", ")}`);
  }

  const selectParts = Object.keys(schemas[mainTable] || {}).map(
    (f) => `"${mainTable}"."${f}" AS "${f}"`
  );
  const whereParts: string[] = options.where ? [options.where] : [];
  Object.entries(options.rels || {}).forEach(([relName, rel]) => {
    const table = `${rel.ns}__${rel.table}`;
    const fkTable = `${rel.fkNs}__${rel.fkTable}`;
    const schema = schemas[table];
    selectParts.push(
      ...Object.keys(schema || {}).map(
        (key) => `"${table}"."${key}" AS "${relName}__${key}"`
      )
    );
    whereParts.push(`"${table}"."${rel.field}" = "${fkTable}"."${rel.fkField}"`);
  });

  const select = selectParts.join(", ");
  const from = Object.keys(tables).join('", "');
  const where =
    whereParts.length > 0 ? " WHERE " + whereParts.join(" AND ") : "";

  const orderByParts = ensureArray(options.orderBy || []);
  const orderDirection = options.orderDirection || "ASC";
  const orderBy =
    orderByParts.length > 0
      ? ` ORDER BY "${orderByParts.join('", "')}" ${orderDirection}`
      : "";

  return `SELECT ${select} FROM "${from}"${where}${orderBy}`;
}
