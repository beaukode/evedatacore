export const fuelFactor = 0.01;

export const asmTypeLabels = {
  NWN: "Network Node",
  ST: "Turret",
  SG: "Gate",
  hangar: "Hangar",
  industry: "Industry",
  storage: "Storage",
  structure: "Structure",
  relay: "Relay",
};

export type AssemblyType = keyof typeof asmTypeLabels;

export const asmTypeLabel = {
  84556: "Smart Turret",
  84955: "Smart Gate",
  88086: "Small Gate",
  87162: "Portable Printer",
  87119: "Printer S",
  88067: "Printer M",
  87120: "Printer L",
  87161: "Portable Refinery",
  88063: "Refinery M",
  88064: "Refinery L",
  88068: "Assembler",
  88069: "Shipyard S",
  88070: "Shipyard M",
  88071: "Shipyard L",
  88092: "Network Node",
  87160: "Refuge",
  88093: "Hangar M",
  88094: "Hangar L",
  88098: "Totem 1",
  88099: "Totem 2",
  88100: "Wall 1",
  88101: "Wall 2",
  90184: "Relay",
  87566: "Portable Storage",
  88082: "Smart Storage Unit S",
  88083: "Smart Storage Unit M",
  77917: "Smart Storage Unit L",
};

export type AssemblyTypeId = keyof typeof asmTypeLabel;

export const asmTypeIdToType: Record<AssemblyTypeId, AssemblyType> = {
  84556: "ST",
  84955: "SG",
  88086: "SG",
  87119: "industry",
  87120: "industry",
  87161: "industry",
  87162: "industry",
  88063: "industry",
  88064: "industry",
  88067: "industry",
  88068: "industry",
  88069: "industry",
  88070: "industry",
  88071: "industry",
  88092: "NWN",
  87160: "hangar",
  88093: "hangar",
  88094: "hangar",
  88098: "structure",
  88099: "structure",
  88100: "structure",
  88101: "structure",
  90184: "relay",
  87566: "storage",
  77917: "storage",
  88082: "storage",
  88083: "storage",
};

export type SmartAssemblyType = keyof typeof asmTypeIdToType;

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
  Maul: {
    mass: 548435920,
    fuel: 24160,
    fuelType: "SOF-40",
  },
} as const;

export type ShipType = keyof typeof ships;

export const columnWidths = {
  common: 300,
  address: 400,
  datetime: 210,
  solarSystem: 150,
};
