import { isHex } from "viem";

export * from "./listSelectedTables";
export * from "./queryBuilder";

export function toSqlHex(value: string) {
  if (value.startsWith("0x")) {
    return "\\" + value.substring(1);
  }
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function incrementHex(hexString: string): string {
  if (!isHex(hexString)) {
    throw new Error("Invalid hex string");
  }
  hexString = hexString.slice(2);

  // Convert the hex string to an array of numbers (digits)
  const hexDigits = hexString.split("").map((char) => parseInt(char, 16));

  // Start incrementing from the last digit
  for (let i = hexDigits.length - 1; i >= 0; i--) {
    let v = hexDigits[i] || 0;
    if (v < 15) {
      // If digit is less than 'f' (15 in decimal)
      v += 1;
      hexDigits[i] = v;
      break;
    } else {
      // Reset current digit to 0 and continue to the next digit
      hexDigits[i] = 0;
    }
  }

  // If all digits were 'f', we need to add a new digit at the beginning
  if (hexDigits[0] === 0) {
    hexDigits.unshift(1);
  }

  // Convert the digits back to a hex string
  const incrementedHexString = hexDigits
    .map((digit) => digit.toString(16))
    .join("");

  // Add the 'x' prefix back
  return "0x" + incrementedHexString;
}
