import Dexie, { EntityTable, Transaction, TransactionMode } from "dexie";
import z from "zod";
import { omit } from "lodash-es";
import { UserDatabaseRecord } from "./main";

export const systemRecordSchema = z.object({
  id: z.string(),
  notes: z.string().optional(),
  color: z.string().optional(),
  content: z.array(z.string()).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export interface BulkSystemsOptions {
  create?: SystemRecord[];
  update?: SystemRecord[];
  delete?: string[];
}

export type SystemRecord = z.infer<typeof systemRecordSchema>;

export type UserDatabase = {
  updateSystem: (system: SystemRecord) => Promise<void>;
  importSystems: (systems: SystemRecord[]) => Promise<void>;
  listSystems: () => Promise<SystemRecord[]>;
  deleteSystems: (ids: string[]) => Promise<void>;
  countSystems: () => Promise<number>;
  listSystemsByIds: (ids: string[]) => Promise<SystemRecord[]>;
  deleteDatabase: () => Promise<void>;
  transaction: <R>(
    mode: TransactionMode,
    fn: (tx: Transaction) => Promise<R>
  ) => Promise<R>;
  close: () => Promise<void>;
  metadata: UserDatabaseRecord;
};

export async function openUserDatabase(
  slug: string,
  metadata: UserDatabaseRecord
): Promise<UserDatabase> {
  const db = new Dexie(`evedatacore-${slug}`, {
    autoOpen: false,
  }) as Dexie & {
    systems: EntityTable<SystemRecord, "id">;
  };

  db.version(1).stores({
    systems: "++id, createdAt, updatedAt, *content",
  });

  async function updateSystem(system: SystemRecord) {
    await db.systems
      .upsert(system.id, {
        ...omit(system, "id", "createdAt", "updatedAt"),
        updatedAt: Date.now(),
      })
      .then((updated) => {
        if (!updated) {
          return db.systems.update(system.id, {
            createdAt: Date.now(),
          });
        }
      });
  }

  async function importSystems(systems: SystemRecord[]) {
    await db.systems.bulkPut(systems);
  }

  async function deleteSystems(ids: string[]) {
    await db.systems.bulkDelete(ids);
  }

  async function listSystems() {
    return db.systems.orderBy("updatedAt").reverse().toArray();
  }

  async function countSystems() {
    return db.systems.count();
  }

  async function listSystemsByIds(ids: string[]) {
    return db.systems.where("id").anyOf(ids).toArray();
  }

  async function deleteDatabase() {
    await db.delete();
  }

  async function transaction<R>(
    mode: TransactionMode,
    fn: (tx: Transaction) => Promise<R>
  ): Promise<R> {
    return db.transaction(mode, db.systems, fn);
  }

  async function close() {
    await db.close({ disableAutoOpen: true });
  }

  await db.open();

  return {
    updateSystem,
    importSystems,
    listSystems,
    deleteSystems,
    countSystems,
    listSystemsByIds,
    deleteDatabase,
    transaction,
    close,
    metadata,
  };
}
