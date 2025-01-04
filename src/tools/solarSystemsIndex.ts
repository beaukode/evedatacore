import { FixedGetSolarsystemsResponse, SolarSystem } from "@/api/stillness";

export interface SolarSystemsIndex {
  searchByName: (value: string) => SolarSystem[];
  getById: (id: string) => SolarSystem | undefined;
}

type IndexedSolarSystem = SolarSystem & { lSolarSystemName: string };

interface IndexByName {
  [firstLetter: string]: IndexedSolarSystem[];
}

export function createSolarSystemsIndex(
  data: FixedGetSolarsystemsResponse
): SolarSystemsIndex {
  const indexByName: IndexByName = {};

  Object.values(data).forEach((value) => {
    const solarSystemName = value.solarSystemName.toLowerCase();
    const firstLetter = solarSystemName.charAt(0).toLowerCase();
    if (!indexByName[firstLetter]) {
      indexByName[firstLetter] = [];
    }
    indexByName[firstLetter].push({
      ...value,
      lSolarSystemName: solarSystemName,
    });
  });

  function searchByName(value: string): SolarSystem[] {
    if (!value) {
      return Object.values(data);
    }
    const firstLetter = value.charAt(0).toLowerCase();

    if (indexByName[firstLetter]) {
      return indexByName[firstLetter].filter((solarSystem) =>
        solarSystem.lSolarSystemName.toLowerCase().includes(value.toLowerCase())
      );
    }

    return [];
  }

  function getById(id: string): SolarSystem {
    return data[id];
  }

  return {
    searchByName,
    getById,
  };
}
