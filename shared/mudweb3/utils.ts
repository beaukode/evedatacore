import { parseAbiItem, toFunctionSelector } from "viem";

export type DecodedFunctionSignature = {
  abi?: object;
  selector?: string;
  decodeError?: string;
};

export function decodeFunctionSignature(
  signature: string
): DecodedFunctionSignature {
  try {
    if (typeof signature !== "string") {
      throw new Error("Not implemented");
    }
    let s = signature.trim();
    if (!s) return {};
    if (!s.startsWith("function")) {
      s = "function " + s;
    }
    const abi = parseAbiItem(s);
    const selector = toFunctionSelector(s);
    return { abi, selector };
  } catch (e) {
    if (e instanceof Error) {
      return { decodeError: e.message };
    } else {
      return { decodeError: "Error" };
    }
  }
}
