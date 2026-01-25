import Dexie, { EntityTable } from "dexie";
import { omit } from "lodash-es";
import { UserDatabaseRecord } from "./main";

export type SystemRecord = {
  id: string;
  notes?: string;
  color?: string;
  content?: string[];
  createdAt: number;
  updatedAt: number;
};

export type UserDatabase = {
  updateSystem: (system: SystemRecord) => Promise<void>;
  importSystems: (systems: SystemRecord[]) => Promise<void>;
  listSystems: () => Promise<SystemRecord[]>;
  countSystems: () => Promise<number>;
  listSystemsByIds: (ids: string[]) => Promise<SystemRecord[]>;
  deleteDatabase: () => Promise<void>;
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

  async function close() {
    await db.close({ disableAutoOpen: true });
  }

  await db.open();

  return {
    updateSystem,
    importSystems,
    listSystems,
    countSystems,
    listSystemsByIds,
    deleteDatabase,
    close,
    metadata,
  };
}
