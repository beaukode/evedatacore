import { FixedGetTypesResponse, Type } from "@/api/stillness";
import { shorten } from "./index";
import { pick } from "lodash-es";

export type IndexedType = Type & {
  id: string;
  groupId: number;
  groupName: string;
  categoryId: number;
  categoryName: string;
};

export type InventoryItem = Pick<
  IndexedType,
  "id" | "smartItemId" | "name" | "image"
> & {
  quantity: number;
};

export interface TypesIndex {
  getAll: () => IndexedType[];
  getCatergories: () => Record<number, TypeCategory>;
  getById: (id: string) => IndexedType | undefined;
  getBySmartItemId: (smartItemId: string) => IndexedType | undefined;
  inventoryItemsToArray: (
    smartItems: Record<string, number>
  ) => InventoryItem[];
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
    if (type.smartItemId) {
      indexBySmartItemId[type.smartItemId] = type;
    }
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

  function inventoryItemsToArray(
    items: Record<string, number>
  ): InventoryItem[] {
    return Object.entries(items)
      .map(([itemId, quantity]) => {
        const type = indexBySmartItemId[itemId];
        if (!type) {
          return {
            id: itemId,
            smartItemId: itemId,
            name: shorten(itemId.toString()),
            image: "",
            quantity,
          };
        }
        return {
          ...pick(type, ["id", "smartItemId", "name", "image"]),
          quantity,
        };
      })
      .filter((i) => i !== undefined);
  }

  return {
    getAll,
    getCatergories,
    getById,
    getBySmartItemId,
    inventoryItemsToArray,
  };
}
