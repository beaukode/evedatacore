import { GetSolarsystemsResponse, types_SolarSystem } from "@/api/stillness";

export interface SolarSystemsIndex {
  searchByName: (value: string) => types_SolarSystem[];
  getById: (id: string) => types_SolarSystem | undefined;
}

interface IndexByName {
  [firstLetter: string]: types_SolarSystem[];
}

export function createSolarSystemsIndex(
  data: GetSolarsystemsResponse
): SolarSystemsIndex {
  const indexByName: IndexByName = {};

  Object.values(data).forEach((value) => {
    const solarSystemName = value.solarSystemName.toLowerCase();
    const firstLetter = solarSystemName.charAt(0).toLowerCase();
    if (!indexByName[firstLetter]) {
      indexByName[firstLetter] = [];
    }
    indexByName[firstLetter].push({ ...value, solarSystemName });
  });

  function searchByName(value: string): types_SolarSystem[] {
    if (!value) {
      return Object.values(data);
    }
    const firstLetter = value.charAt(0).toLowerCase();

    if (indexByName[firstLetter]) {
      return indexByName[firstLetter].filter((solarSystem) =>
        solarSystem.solarSystemName.toLowerCase().includes(value.toLowerCase())
      );
    }

    return [];
  }

  function getById(id: string): types_SolarSystem {
    return data[id];
  }

  return {
    searchByName,
    getById,
  };
}
