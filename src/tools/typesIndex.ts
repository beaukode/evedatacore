import { InventoryItem } from "@/api/mudsql";
import { FixedGetTypesResponse, Type } from "@/api/stillness";

export type IndexedType = Type & {
  id: string;
  groupId: number;
  groupName: string;
  categoryId: number;
  categoryName: string;
};

export type SmartItemWithType = InventoryItem & {
  id: string;
  name: string;
  image?: string;
};

export interface TypesIndex {
  getAll: () => IndexedType[];
  getCatergories: () => Record<number, TypeCategory>;
  getById: (id: string) => IndexedType | undefined;
  getBySmartItemId: (smartItemId: string) => IndexedType | undefined;
  mergeSmartItemAndType: (smartItems: InventoryItem[]) => SmartItemWithType[];
}

export type TypeCategory = {
  name: string;
  groups: Record<number, string>;
};

export function createTypesIndex(data: FixedGetTypesResponse): TypesIndex {
  const categories: Record<number, TypeCategory> = {};
  const allTypes: IndexedType[] = Object.entries(data || {})
    .map(([k, v]) => {
      let groupId: number = 0;
      let groupName: string = "";
      let categoryId: number = 0;
      let categoryName: string = "";
      if (Array.isArray(v.attributes)) {
        for (const o of v.attributes) {
          if (o.trait_type === "groupID") {
            groupId = o.value as unknown as number;
          } else if (o.trait_type === "groupName") {
            groupName = o.value as unknown as string;
          } else if (o.trait_type === "categoryID") {
            categoryId = o.value as unknown as number;
          } else if (o.trait_type === "categoryName") {
            categoryName = o.value as unknown as string;
          }
        }
      }
      const category = categories[categoryId];
      if (!category) {
        categories[categoryId] = {
          name: categoryName,
          groups: { [groupId]: groupName },
        };
      } else {
        category.groups[groupId] = groupName;
      }
      return {
        id: k,
        ...v,
        groupId,
        groupName,
        categoryId,
        categoryName,
      };
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const indexById: Record<string, IndexedType> = {};
  const indexBySmartItemId: Record<string, IndexedType> = {};
  for (const type of allTypes) {
    indexById[type.id] = type;
    indexBySmartItemId[type.smartItemId || ""] = type;
  }

  function getAll() {
    return allTypes;
  }

  function getCatergories() {
    return categories;
  }

  function getById(id: string) {
    return indexById[id];
  }

  function getBySmartItemId(smartItemId: string) {
    return indexBySmartItemId[smartItemId];
  }

  function mergeSmartItemAndType(
    smartItems: InventoryItem[]
  ): SmartItemWithType[] {
    return smartItems.map((i) => {
      const type = indexBySmartItemId[i.itemId];
      return {
        ...i,
        id: type?.id || "0",
        name: type?.name || "Unknown item",
        image: type?.image,
      };
    });
  }

  return {
    getAll,
    getCatergories,
    getById,
    getBySmartItemId,
    mergeSmartItemAndType,
  };
}
