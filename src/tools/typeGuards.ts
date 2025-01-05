import { fuels, FuelType, ships, ShipType } from "@/constants";

export function isFuelType(value: unknown): value is FuelType {
  return typeof value === "string" && value in fuels;
}

export function isShipType(value: unknown): value is ShipType {
  return typeof value === "string" && value in ships;
}
