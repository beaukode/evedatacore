import { vi } from "vitest";
import { SolarSystem, SolarSystemsIndex } from "../solarSystemsIndex";

// Mock solar systems index
const mockSolarSystemsIndex: SolarSystemsIndex = {
  searchByName: vi.fn(),
  getById: vi.fn((id: string | number) => {
    const systems: Record<string, SolarSystem> = {
      ["1001"]: {
        name: "Jita",
        location: ["0", "400", "300"],
      },
      ["1002"]: {
        name: "Perimeter",
        location: ["0", "0", "0"],
      },
      ["1003"]: {
        name: "Dodixie",
        location: ["0", "800", "600"],
      },
    };
    return systems[id];
  }),
};

export const createSolarSystemsIndex = vi.fn(() => mockSolarSystemsIndex);
