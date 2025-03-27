import Big from "big.js";

export type Location = {
  x: string | number;
  y: string | number;
  z: string | number;
};

export function lyDistance(locationA: Location, locationB: Location): number {
  const s1x = new Big(locationA.x);
  const s1y = new Big(locationA.y);
  const s1z = new Big(locationA.z);
  const s2x = new Big(locationB.x);
  const s2y = new Big(locationB.y);
  const s2z = new Big(locationB.z);
  const meters = s1x
    .minus(s2x)
    .pow(2)
    .plus(s1y.minus(s2y).pow(2))
    .plus(s1z.minus(s2z).pow(2))
    .sqrt();
  const ly = meters.div(new Big(9.46073047258e15));
  return ly.toNumber();
}
