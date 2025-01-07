import { describe, it, expect } from "vitest";
import { queryBuilder } from "../queryBuilder";
import { Schema } from "@latticexyz/config";
import { SelectOptions } from "../../types";

describe("queryBuilder", () => {
  const schemas: Record<string, Schema> = {
    ns__table: {
      id: {
        type: "address",
        internalType: "address",
      },
      name: {
        type: "bytes32",
        internalType: "bytes32",
      },
    },
    ns__relatedTable: {
      userAddress: {
        type: "address",
        internalType: "address",
      },
      userName: {
        type: "bytes32",
        internalType: "bytes32",
      },
    },
    ns2__anotherRelatedTable: {
      userAddress: {
        type: "address",
        internalType: "address",
      },
      userTokenId: {
        type: "uint256",
        internalType: "uint256",
      },
    },
  };

  it("should build a simple select query", () => {
    const options: SelectOptions = {};
    const query = queryBuilder("ns", "table", options, schemas);
    expect(query).toBe('SELECT "id", "name" FROM ns__table');
  });

  it("should build a select query with where clause", () => {
    const options: SelectOptions = {
      where: "id = 1",
    };
    const query = queryBuilder("ns", "table", options, schemas);
    expect(query).toBe('SELECT "id", "name" FROM ns__table WHERE id = 1');
  });

  it("should build a select query with 2 relations", () => {
    const options: SelectOptions = {
      rels: {
        related: {
          ns: "ns",
          table: "relatedTable",
          field: "userAddress",
          fkNs: "ns",
          fkTable: "table",
          fkField: "id",
        },
      },
    };
    const query = queryBuilder("ns", "table", options, schemas);
    expect(query).toBe(
      'SELECT "id", "name", ns__relatedTable."userAddress" AS "related__userAddress", ns__relatedTable."userName" AS "related__userName" FROM ns__table, ns__relatedTable WHERE ns__relatedTable."userAddress" = ns__table."id"'
    );
  });

  it("should build a select query with 2 relations and a where clause", () => {
    const options: SelectOptions = {
      where: `"id" = '/xf7730eb77b66f21fea19d49ee6a4718ff9c0393e'`,
      rels: {
        related: {
          ns: "ns",
          table: "relatedTable",
          field: "userAddress",
          fkNs: "ns",
          fkTable: "table",
          fkField: "id",
        },
      },
    };
    const query = queryBuilder("ns", "table", options, schemas);
    expect(query).toBe(
      `SELECT "id", "name", ns__relatedTable."userAddress" AS "related__userAddress", ns__relatedTable."userName" AS "related__userName" FROM ns__table, ns__relatedTable WHERE "id" = '/xf7730eb77b66f21fea19d49ee6a4718ff9c0393e' AND ns__relatedTable."userAddress" = ns__table."id"`
    );
  });

  it("should build a select query with 3 relations", () => {
    const options: SelectOptions = {
      rels: {
        related: {
          ns: "ns",
          table: "relatedTable",
          field: "userAddress",
          fkNs: "ns",
          fkTable: "table",
          fkField: "id",
        },
        anotherRelated: {
          ns: "ns2",
          table: "anotherRelatedTable",
          field: "userAddress",
          fkNs: "ns",
          fkTable: "table",
          fkField: "id",
        },
      },
    };
    const query = queryBuilder("ns", "table", options, schemas);
    expect(query).toBe(
      'SELECT "id", "name", ns__relatedTable."userAddress" AS "related__userAddress", ns__relatedTable."userName" AS "related__userName", ns2__anotherRelatedTable."userAddress" AS "anotherRelated__userAddress", ns2__anotherRelatedTable."userTokenId" AS "anotherRelated__userTokenId" FROM ns__table, ns__relatedTable, ns2__anotherRelatedTable WHERE ns__relatedTable."userAddress" = ns__table."id" AND ns2__anotherRelatedTable."userAddress" = ns__table."id"'
    );
  });

  it("should throw an error if schemas are missing", async () => {
    const options: SelectOptions = {
      rels: {
        related: {
          ns: "ns",
          table: "missingTable",
          fkNs: "ns",
          fkTable: "table",
          field: "tableId",
          fkField: "id",
        },
      },
    };
    expect(() => queryBuilder("ns", "table", options, schemas)).toThrow(
      "Missing schemas for tables: ns__missingTable"
    );
  });
});
