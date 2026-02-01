import z from "zod";
import { SystemRecord, systemRecordSchema, UserDatabase } from "./user";
import { keyBy } from "lodash-es";

export type ImportStrategyRecordChange = "c" | "u" | "d";

export interface ImportStrategyResult {
  details: Map<string, ImportStrategyRecordChange>;
  created: number;
  updated: number;
  deleted: number;
}

export type ImportStrategyMethod = "replace" | "merge" | "merge-newer";

export interface ImportFileStrategyOptions {
  file: File;
  method: ImportStrategyMethod;
}

const inputDataSchema = z.array(systemRecordSchema);

type InputData = z.infer<typeof inputDataSchema>;

export interface ImportFileStrategyComponentProps {
  dryRun: (options: ImportFileStrategyOptions) => Promise<ImportStrategyResult>;
  execute: (
    options: ImportFileStrategyOptions
  ) => Promise<ImportStrategyResult>;
}

export function importFileStrategy(db: UserDatabase) {
  const dryRunHandlers: Record<
    ImportStrategyMethod,
    (data: InputData) => Promise<ImportStrategyResult>
  > = {
    replace: async (data) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const r: ImportStrategyResult = {
        details: new Map(),
        created: 0,
        updated: 0,
        deleted: 0,
      };

      for (const item of data) {
        if (currentSystems[item.id]) {
          r.details.set(item.id, "u");
          r.updated++;
          delete currentSystems[item.id];
        } else {
          r.details.set(item.id, "c");
          r.created++;
        }
      }
      for (const id of Object.keys(currentSystems)) {
        r.details.set(id, "d");
        r.deleted++;
      }
      return r;
    },
    merge: async (data) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const r: ImportStrategyResult = {
        details: new Map(),
        created: 0,
        updated: 0,
        deleted: 0,
      };

      for (const item of data) {
        if (currentSystems[item.id]) {
          r.details.set(item.id, "u");
          r.updated++;
        } else {
          r.details.set(item.id, "c");
          r.created++;
        }
      }
      return r;
    },
    "merge-newer": async (data) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const r: ImportStrategyResult = {
        details: new Map(),
        created: 0,
        updated: 0,
        deleted: 0,
      };

      for (const item of data) {
        if (currentSystems[item.id]) {
          if (currentSystems[item.id]!.updatedAt < item.updatedAt) {
            r.details.set(item.id, "u");
            r.updated++;
          }
        } else {
          r.details.set(item.id, "c");
          r.created++;
        }
      }
      return r;
    },
  };

  const executeHandlers: Record<
    ImportStrategyMethod,
    (data: InputData, expected: ImportStrategyResult) => Promise<void>
  > = {
    replace: async (data, expected) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const toCreate: SystemRecord[] = [];
      const toUpdate: SystemRecord[] = [];

      for (const item of data) {
        if (currentSystems[item.id]) {
          toUpdate.push(item);
          delete currentSystems[item.id];
        } else {
          toCreate.push(item);
        }
      }
      const toDelete = Object.keys(currentSystems);

      if (
        toCreate.length !== expected.created ||
        toUpdate.length !== expected.updated ||
        toDelete.length !== expected.deleted
      ) {
        throw new Error("Expected result does not match actual result");
      }
      await db.importSystems([...toCreate, ...toUpdate]);
      await db.deleteSystems(toDelete);
    },
    merge: async (data, expected) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const toCreate: SystemRecord[] = [];
      const toUpdate: SystemRecord[] = [];

      for (const item of data) {
        if (currentSystems[item.id]) {
          toUpdate.push(item);
        } else {
          toCreate.push(item);
        }
      }

      if (
        toCreate.length !== expected.created ||
        toUpdate.length !== expected.updated ||
        0 !== expected.deleted
      ) {
        throw new Error("Expected result does not match actual result");
      }
      await db.importSystems([...toCreate, ...toUpdate]);
    },
    "merge-newer": async (data, expected) => {
      const currentSystems = await db
        .listSystems()
        .then((systems) => keyBy(systems, "id"));

      const toCreate: SystemRecord[] = [];
      const toUpdate: SystemRecord[] = [];

      for (const item of data) {
        if (currentSystems[item.id]) {
          if (currentSystems[item.id]!.updatedAt < item.updatedAt) {
            toUpdate.push(item);
          }
        } else {
          toCreate.push(item);
        }
      }

      if (
        toCreate.length !== expected.created ||
        toUpdate.length !== expected.updated ||
        0 !== expected.deleted
      ) {
        throw new Error("Expected result does not match actual result");
      }
      await db.importSystems([...toCreate, ...toUpdate]);
    },
  };

  async function dryRun(
    options: ImportFileStrategyOptions
  ): Promise<ImportStrategyResult> {
    const { file, method } = options;
    const text = await file.text();
    const json = JSON.parse(text);
    const { success, data } = inputDataSchema.safeParse(json);
    if (!success) {
      throw new Error("Invalid input data");
    }
    return dryRunHandlers[method](data);
  }

  async function execute(
    options: ImportFileStrategyOptions
  ): Promise<ImportStrategyResult> {
    const { file, method } = options;
    const text = await file.text();
    const json = JSON.parse(text);
    const { success, data } = inputDataSchema.safeParse(json);
    if (!success) {
      throw new Error("Invalid input data");
    }

    return db.transaction("readwrite", async () => {
      const expected = await dryRunHandlers[method](data);
      await executeHandlers[method](data, expected);
      return expected;
    });
  }

  return {
    dryRun,
    execute,
  };
}
