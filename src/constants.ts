import { AssemblyType } from "@/api/mudsql";

export const fuelFactor = 0.01;

export const smartAssembliesTypes = {
  [AssemblyType.Gate]: "Smart Gate",
  [AssemblyType.Turret]: "Smart Turret",
  [AssemblyType.Storage]: "Smart Storage Unit",
  [AssemblyType.NetworkNode]: "Network Node",
  [AssemblyType.Hangar]: "Smart Hangar",
  [AssemblyType.Manufacturer]: "Smart Manufacturer",
} as const;

export type SmartAssemblyType = keyof typeof smartAssembliesTypes;

export const smartAssemblyStates = {
  1: "Unanchored",
  2: "Anchored",
  3: "Online",
  4: "Destroyed",
} as const;

export type SmartAssemblyState = keyof typeof smartAssemblyStates;

export type Fuel = {
  efficiency: number;
};

export const fuels = {
  "D1 Fuel": { efficiency: 0.1 },
  "D2 Fuel": { efficiency: 0.15 },
  "SOF-40": { efficiency: 0.4 },
  "EU-40": { efficiency: 0.4 },
  "SOF-80": { efficiency: 0.8 },
  "EU-90": { efficiency: 0.9 },
} as const;

export type FuelType = keyof typeof fuels;

export type Ship = {
  mass: number;
  fuel: number;
  fuelType: keyof typeof fuels;
  image?: string;
};

export const ships: Record<string, Ship> = {
  HAF: {
    mass: 81883000,
    fuel: 4184,
    fuelType: "SOF-40",
  },
  LORHA: {
    mass: 31369320,
    fuel: 2508,
    fuelType: "SOF-40",
  },
  MCF: {
    mass: 52313760,
    fuel: 6548,
    fuelType: "SOF-40",
  },
  TADES: {
    mass: 74655480,
    fuel: 5972,
    fuelType: "SOF-40",
  },
  USV: {
    mass: 30266600,
    fuel: 2420,
    fuelType: "SOF-40",
  },
  Recurve: {
    mass: 10400000,
    fuel: 970,
    fuelType: "D1 Fuel",
  },
  Reflex: {
    mass: 9750000,
    fuel: 1750,
    fuelType: "D1 Fuel",
  },
  Reiver: {
    mass: 10200000,
    fuel: 1416,
    fuelType: "D1 Fuel",
  },
  Wend: {
    mass: 6800000,
    fuel: 200,
    fuelType: "D1 Fuel",
  },
  Chumaq: {
    mass: 1739489520,
    fuel: 270585,
    fuelType: "SOF-40",
  },
} as const;

export type ShipType = keyof typeof ships;

export const columnWidths = {
  common: 300,
  address: 400,
  datetime: 210,
};
