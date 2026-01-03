import Dexie, { EntityTable } from "dexie";

export type UserDatabaseRecord = {
  slug: string;
  name: string;
  type: "local" | "remote";
  createdAt: number;
  updatedAt: number;
};

export type MainDatabase = {
  listUserDatabases: () => Promise<UserDatabaseRecord[]>;
  createUserDatabase: (slug: string, name: string) => Promise<boolean>;
  getUserDatabase: (slug: string) => Promise<UserDatabaseRecord | undefined>;
  deleteUserDatabase: (slug: string) => Promise<void>;
  close: () => Promise<void>;
};

export async function openMainDatabase() {
  const db = new Dexie("evedatacore", {
    autoOpen: false,
  }) as Dexie & {
    userDatabases: EntityTable<UserDatabaseRecord, "slug">;
  };

  db.version(1).stores({
    userDatabases: "slug, name, createdAt",
  });

  async function listUserDatabases() {
    return await db.userDatabases.orderBy("name").toArray();
  }

  async function getUserDatabase(slug: string) {
    return await db.userDatabases.get(slug);
  }

  async function createUserDatabase(
    slug: string,
    name: string
  ): Promise<boolean> {
    return await db.userDatabases
      .add({
        slug,
        name,
        type: "local",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .then(() => true)
      .catch(() => false); // Already exists
  }

  async function deleteUserDatabase(slug: string) {
    await db.userDatabases.delete(slug);
  }

  async function close() {
    await db.close({ disableAutoOpen: true });
  }

  await db.open();

  const mainNamespace = await db.userDatabases.get("main");
  if (!mainNamespace) {
    await db.userDatabases.add({
      slug: "main",
      name: "Main",
      type: "local",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return {
    listUserDatabases,
    getUserDatabase,
    createUserDatabase,
    deleteUserDatabase,
    close,
  };
}
