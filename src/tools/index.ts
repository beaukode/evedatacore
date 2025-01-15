import Big from "big.js";

export function shorten(
  text?: string,
  length: number = 16
): string | undefined {
  if (text && text.length > length) {
    return (
      text.substring(0, Math.round(length / 2)) +
      "..." +
      text.substring(text.length - Math.round(length / 2))
    );
  }
  return text;
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

export function formatCrypto(value: string | undefined): string {
  if (value === undefined) return "";
  try {
    return new Big(value).div(new Big(10).pow(18)).toString();
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
    return v.div(m).toFixed(2);
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

export function tsToDateTime(value?: number): string {
  if (!value) return "";
  const isoDate = new Date(value).toISOString();
  return isoDate.substring(0, 10) + " " + isoDate.substring(11, 19);
}
