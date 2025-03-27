import { vi } from "vitest";
import { SolarSystemsIndex } from "../solarSystemsIndex";
import { type Location } from "../../api/stillness";

// Mock solar systems index
const mockSolarSystemsIndex: SolarSystemsIndex = {
  searchByName: vi.fn(),
  getById: vi.fn((id: string) => {
    const systems: Record<
      string,
      { solarSystemId: number; solarSystemName: string; location: Location }
    > = {
      ["1001"]: {
        solarSystemId: 1001,
        solarSystemName: "Jita",
        location: { x: "0", y: "400", z: "300" },
      },
      ["1002"]: {
        solarSystemId: 1002,
        solarSystemName: "Perimeter",
        location: { x: "0", y: "0", z: "0" },
      },
      ["1003"]: {
        solarSystemId: 1003,
        solarSystemName: "Dodixie",
        location: { x: "0", y: "800", z: "600" },
      },
    };
    return systems[id];
  }),
};

export const createSolarSystemsIndex = vi.fn(() => mockSolarSystemsIndex);
