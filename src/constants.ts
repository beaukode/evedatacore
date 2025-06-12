import { AssemblyType } from "@shared/mudsql/types";

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
  Anser: {
    mass: 281681000,
    fuel: 7050,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmcsyZM3V81b59R3PKm8o93vMTYyh3BSXLr9iUvPM62ufY",
  },
  Axte: {
    mass: 800711000,
    fuel: 22030,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmazawrffP8SVcUdDvMoZAAaZ14kXQ4fGmjmkXDpzxt4wn",
  },
  Baile: {
    mass: 487820000,
    fuel: 12200,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmNwGEMfmJLsT3UZdRpjfNgRL9XB3PbndonG1rigiS6Q1i",
  },
  Caruda: {
    mass: 1424833000,
    fuel: 49870,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmWbPLQhTtkx3MfevyKWCTKbBZiR6hEEPg7yuga8ENW1dg",
  },
  Dremar: {
    mass: 68221000,
    fuel: 1110,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmRaHLUTUPhbzweyZU4qvMoFqtKNyU57rB3htPt3tWLSo6",
  },
  Explorer: {
    mass: 4517000,
    fuel: 230,
    fuelType: "D2 Fuel",
  },
  Flegel: {
    mass: 142121000,
    fuel: 2860,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmXwQNtnQYJc5eT4sTAiAhudcq59qJSQghos9rVAF7zFN9",
  },
  Forager: { mass: 7642000, fuel: 120, fuelType: "D1 Fuel" },
  Grus: {
    mass: 2383202000,
    fuel: 71340,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmR1UMFyikEv2MGVxgntMEZS8qFbTY78c4U3EaNdW5xs6f",
  },
  Harpia: {
    mass: 62359000,
    fuel: 95300,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmR1UMFyikEv2MGVxgntMEZS8qFbTY78c4U3EaNdW5xs6f",
  },
  Juav: {
    mass: 12928000,
    fuel: 360,
    fuelType: "D1 Fuel",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmXshWcMSvt5mCgCapnhMqvxF14AbamcMaUKB3BJS2pNnr",
  },
  Klinge: {
    mass: 798858000,
    fuel: 21970,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmTwM1FF7X2tNVLkvqNJ7qnuGXvvrDJUrDchMArFhzoJXj",
  },
  Microptero: {
    mass: 20464000,
    fuel: 240,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmchGgYrRT45dH9EEnnzdXGsQuxE5oCMnnckEDvA9UCHCe",
  },
  Pici: {
    mass: 25921000,
    fuel: 320,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmPTsfuXJZm6rWyfZck8VSDh9gVHhUQnZCMZiJikk8pEPU",
  },
  Raubtier: {
    mass: 45402000,
    fuel: 690,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/Qmeg4xGuCGkwi6KyXKDGjw9ViwtM7BUxzdNv28JfQCQTmH",
  },
  "Rebus-K": {
    mass: 1474255000,
    fuel: 41620,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmQFfkPKYdPTpYfPR6qh9zPX127F7SC7DNtsYt2CLQ9Kzs",
  },
  "Samoskyd-1": {
    mass: 24552000,
    fuel: 300,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmQG9VTiTdspTxryqZ3cuBoPETbsnRV5NcymjbuQt5oFwQ",
  },
  Strix: {
    mass: 95376000,
    fuel: 1550,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmTrXyViKaAgMvs1DPmdNb4ytAJen88iq2V1pYiFQuaVEy",
  },

  Ungher: {
    mass: 74389000,
    fuel: 1400,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/Qmbo22RxWw95ayiRf1dvWFqUMibtvS6fJHZ8we9GjgEEoN",
  },
  Val: {
    mass: 27210000,
    fuel: 550,
    fuelType: "SOF-40",
    image:
      "https://ipfs-gateway.live.tech.evefrontier.com/ipfs/QmPgFk5Csw2WbPtr5PfYvfMjnsbUGXDYNp9VmAh5qoLLV9",
  },
} as const;

export type ShipType = keyof typeof ships;

export const columnWidths = {
  common: 300,
  address: 400,
  datetime: 210,
};
