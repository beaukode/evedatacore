import { Dexie, type EntityTable } from "dexie";
import { omit } from "lodash-es";

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

export function updateSystem(system: SystemRecord) {
  return db.systems
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
