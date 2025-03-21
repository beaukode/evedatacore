export enum Optimize {
  FUEL = "fuel",
  DISTANCE = "distance",
  HOPS = "hops",
}

export type SmartGateLink = {
  from: number;
  to: number;
  distance: number;
};
