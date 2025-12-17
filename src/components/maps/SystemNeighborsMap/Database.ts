import { Dexie, type EntityTable } from "dexie";

interface SystemRecord {
  id: string;
  notes?: string;
  color?: string;
  content?: string[];
  createdAt: number;
  updatedAt: number;
}

const db = new Dexie("evedatacore") as Dexie & {
  systems: EntityTable<SystemRecord, "id">;
};

db.version(1).stores({
  systems: "++id, createdAt, updatedAt, *content",
});

export type { SystemRecord };
export { db };
