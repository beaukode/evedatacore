import { describe, it, expect } from "vitest";
import { listSelectedTables } from "../listSelectedTables";
import { SelectOptions } from "../../types";

describe("listSelectedTables", () => {
  it("should return a map with the main table", () => {
    const ns = "namespace";
    const table = "mainTable";
    const options: SelectOptions = { rels: {} };

    const result = listSelectedTables(ns, table, options);

    expect(result).toEqual({
      namespace__mainTable: { ns: "namespace", table: "mainTable" },
    });
  });

  it("should include related tables in the map", () => {
    const ns = "namespace";
    const table = "mainTable";
    const options: SelectOptions = {
      rels: {
        rel1: {
          ns: "relNamespace1",
          table: "relTable1",
          field: "relField1",
          fkNs: "fkNamespace1",
          fkTable: "fkTable1",
          fkField: "fkField1",
        },
        rel2: {
          ns: "relNamespace2",
          table: "relTable2",
          field: "relField2",
          fkNs: "fkNamespace2",
          fkTable: "fkTable2",
          fkField: "fkField2",
        },
      },
    };

    const result = listSelectedTables(ns, table, options);

    expect(result).toEqual({
      namespace__mainTable: { ns: "namespace", table: "mainTable" },
      relNamespace1__relTable1: { ns: "relNamespace1", table: "relTable1" },
      fkNamespace1__fkTable1: { ns: "fkNamespace1", table: "fkTable1" },
      relNamespace2__relTable2: { ns: "relNamespace2", table: "relTable2" },
      fkNamespace2__fkTable2: { ns: "fkNamespace2", table: "fkTable2" },
    });
  });

  it("should not include duplicate related tables in the map", () => {
    const ns = "namespace";
    const table = "mainTable";
    const options: SelectOptions = {
      rels: {
        rel1: {
          ns: "relNamespace1",
          table: "relTable1",
          field: "relField1",
          fkNs: "fkNamespace1",
          fkTable: "fkTable1",
          fkField: "fkField1",
        },
        rel2: {
          ns: "relNamespace2",
          table: "relTable2",
          field: "relField2",
          fkNs: "fkNamespace2",
          fkTable: "fkTable2",
          fkField: "fkField2",
        },
        rel3: {
          ns: "relNamespace2",
          table: "relTable2",
          field: "relField2",
          fkNs: "fkNamespace2",
          fkTable: "fkTable2",
          fkField: "fkField2",
        },
      },
    };

    const result = listSelectedTables(ns, table, options);

    expect(result).toEqual({
      namespace__mainTable: { ns: "namespace", table: "mainTable" },
      relNamespace1__relTable1: { ns: "relNamespace1", table: "relTable1" },
      fkNamespace1__fkTable1: { ns: "fkNamespace1", table: "fkTable1" },
      relNamespace2__relTable2: { ns: "relNamespace2", table: "relTable2" },
      fkNamespace2__fkTable2: { ns: "fkNamespace2", table: "fkTable2" },
    });
  });

  it("should handle empty options", () => {
    const ns = "namespace";
    const table = "mainTable";
    const options: SelectOptions = {};

    const result = listSelectedTables(ns, table, options);

    expect(result).toEqual({
      namespace__mainTable: { ns: "namespace", table: "mainTable" },
    });
  });

  it("should handle undefined options", () => {
    const ns = "namespace";
    const table = "mainTable";
    const options: SelectOptions = { rels: undefined };

    const result = listSelectedTables(ns, table, options);

    expect(result).toEqual({
      namespace__mainTable: { ns: "namespace", table: "mainTable" },
    });
  });
});
