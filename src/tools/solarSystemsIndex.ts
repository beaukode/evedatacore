export interface SolarSystemsIndex {
  searchByName: (value: string) => IndexedSolarSystem[];
  getById: (id: string | number) => SolarSystem | undefined;
}

type IndexedSolarSystem = SolarSystem & {
  id: string;
  lSolarSystemName: string;
};

interface IndexByName {
  [firstLetter: string]: IndexedSolarSystem[];
}

export type SolarSystem = {
  name: string;
  location: [string, string, string];
};

type SolarSystemsIndexData = Record<string, SolarSystem>;

export function createSolarSystemsIndex(
  data: SolarSystemsIndexData
): SolarSystemsIndex {
  const indexByName: IndexByName = {};

  Object.entries(data).forEach(([id, value]) => {
    const solarSystemName = value.name.toLowerCase();
    const firstLetter = solarSystemName.charAt(0);
    if (!indexByName[firstLetter]) {
      indexByName[firstLetter] = [];
    }
    indexByName[firstLetter].push({
      ...value,
      id,
      lSolarSystemName: solarSystemName,
    });
  });

  function searchByName(value: string): IndexedSolarSystem[] {
    const lowerValue = value.trimStart().toLowerCase();
    if (!lowerValue) {
      return [];
    }
    const firstLetter = lowerValue.charAt(0);

    if (indexByName[firstLetter]) {
      return indexByName[firstLetter].filter((solarSystem) =>
        solarSystem.lSolarSystemName.toLowerCase().includes(lowerValue)
      );
    }

    return [];
  }

  function getById(id: string | number): SolarSystem | undefined {
    return data[id.toString()];
  }

  return {
    searchByName,
    getById,
  };
}
