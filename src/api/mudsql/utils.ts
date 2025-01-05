export function toSqlHex(value: string) {
  if (value.startsWith("0x")) {
    return "\\" + value.substring(1);
  }
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
