import Big from "big.js";

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function shorten(
  text?: string,
  length: number = 16,
  ellipsis: string = "..."
): string {
  if (text && text.length > length) {
    return (
      text.substring(0, Math.round(length / 2)) +
      ellipsis +
      text.substring(text.length - Math.round(length / 2))
    );
  }
  return text || "";
}

export function filterInProps<T extends Record<string, unknown>>(
  data: T[],
  search: string,
  props: (keyof T)[],
  additionalFilter?: (item: T) => boolean
): T[] {
  if (!additionalFilter) {
    // if no additional filter is provided, just filter on the search string
    if (!search) return data;
    return data.filter((d) =>
      props.some((prop) =>
        d[prop] ? d[prop].toString().toLowerCase().includes(search) : false
      )
    );
  } else if (search) {
    // if additional filter is provided, filter on both search string and additional filter
    return data.filter((d) =>
      props.some((prop) =>
        d[prop] ? d[prop].toString().toLowerCase().includes(search) : false
      ) && additionalFilter
        ? additionalFilter(d)
        : false
    );
  } else {
    // if no search string is provided, just filter on the additional filter
    return data.filter((d) => additionalFilter(d));
  }
}

export function formatCrypto(
  value: string | undefined,
  decimals?: number
): string {
  if (value === undefined) return "";
  try {
    const r = new Big(value).div(new Big(10).pow(18));
    if (decimals !== undefined) {
      return r.toFixed(decimals);
    } else {
      return r.toString();
    }
  } catch (e) {
    console.error(e);
    return "Error";
  }
}

export function bigPercentage(value: string, max: string): string {
  const v = new Big(value);
  const m = new Big(max);
  if (m.eq(0)) return "0";
  try {
    return v.div(m).mul(100).toFixed(2);
  } catch (e) {
    console.error(e);
    return "Error";
  }
}

export function fuel(
  value: string,
  unitVolume: string,
  factor: number = 1
): number {
  const v = new Big(value);
  const u = new Big(unitVolume);
  if (u.eq(0)) return 0;
  try {
    return v.div(u).mul(factor).toNumber();
  } catch (e) {
    console.error(e);
    return -1;
  }
}

export function ldapDate(value?: number) {
  if (!value) return new Date(0);
  const msSinceUnixEpoch = (value - 116444736000000000) / 10000;
  return new Date(msSinceUnixEpoch);
}

export function ldapToDateTime(value?: number) {
  if (!value) return "";
  const isoDate = ldapDate(value).toISOString();
  return isoDate.substring(0, 10) + " " + isoDate.substring(11, 19);
}

export function tsToDateTime(value?: number): string {
  if (!value) return "";
  if (value < 31467647000) { // If the timestamp is before 1970-12-31, it's in seconds
    value *= 1000;
  }
  const isoDate = new Date(value).toISOString();
  return isoDate.substring(0, 10) + " " + isoDate.substring(11, 19);
}

export function formatLargeNumber(value: string) {
  return new Intl.NumberFormat("en-GB", { useGrouping: true }).format(
    Number(value)
  );
}

export function toJson(value: unknown): string {
  return JSON.stringify(
    value,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
}

export type Location = { x: string; y: string; z: string };

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

export function metersToLy(meters: string): number {
  const m = new Big(meters);
  const ly = m.div(new Big(9.46073047258e15));
  return ly.toNumber();
}
