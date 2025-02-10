import { describe, it, expect } from "vitest";
import { analyzeAbiType } from "../analyzeAbiType";

describe("parseAbiType", () => {
  it("should parse static uint types", () => {
    const expected = {
      baseType: "uint",
      isArray: false,
      isDynamicLength: false,
      length: 8,
    };

    expect(analyzeAbiType("uint8")).toEqual(expected);
    expect(analyzeAbiType("uint16")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("uint24")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("uint32")).toEqual({ ...expected, length: 32 });
    expect(analyzeAbiType("uint40")).toEqual({ ...expected, length: 40 });
    expect(analyzeAbiType("uint48")).toEqual({ ...expected, length: 48 });
    expect(analyzeAbiType("uint56")).toEqual({ ...expected, length: 56 });
    expect(analyzeAbiType("uint64")).toEqual({ ...expected, length: 64 });
    expect(analyzeAbiType("uint72")).toEqual({ ...expected, length: 72 });
    expect(analyzeAbiType("uint80")).toEqual({ ...expected, length: 80 });
    expect(analyzeAbiType("uint88")).toEqual({ ...expected, length: 88 });
    expect(analyzeAbiType("uint96")).toEqual({ ...expected, length: 96 });
    expect(analyzeAbiType("uint104")).toEqual({ ...expected, length: 104 });
    expect(analyzeAbiType("uint112")).toEqual({ ...expected, length: 112 });
    expect(analyzeAbiType("uint120")).toEqual({ ...expected, length: 120 });
    expect(analyzeAbiType("uint128")).toEqual({ ...expected, length: 128 });
    expect(analyzeAbiType("uint136")).toEqual({ ...expected, length: 136 });
    expect(analyzeAbiType("uint144")).toEqual({ ...expected, length: 144 });
    expect(analyzeAbiType("uint152")).toEqual({ ...expected, length: 152 });
    expect(analyzeAbiType("uint160")).toEqual({ ...expected, length: 160 });
    expect(analyzeAbiType("uint168")).toEqual({ ...expected, length: 168 });
    expect(analyzeAbiType("uint176")).toEqual({ ...expected, length: 176 });
    expect(analyzeAbiType("uint184")).toEqual({ ...expected, length: 184 });
    expect(analyzeAbiType("uint192")).toEqual({ ...expected, length: 192 });
    expect(analyzeAbiType("uint200")).toEqual({ ...expected, length: 200 });
    expect(analyzeAbiType("uint208")).toEqual({ ...expected, length: 208 });
    expect(analyzeAbiType("uint216")).toEqual({ ...expected, length: 216 });
    expect(analyzeAbiType("uint224")).toEqual({ ...expected, length: 224 });
    expect(analyzeAbiType("uint232")).toEqual({ ...expected, length: 232 });
    expect(analyzeAbiType("uint240")).toEqual({ ...expected, length: 240 });
    expect(analyzeAbiType("uint248")).toEqual({ ...expected, length: 248 });
    expect(analyzeAbiType("uint256")).toEqual({ ...expected, length: 256 });
  });

  it("should parse static int types", () => {
    const expected = {
      baseType: "int",
      isArray: false,
      isDynamicLength: false,
      length: 8,
    };

    expect(analyzeAbiType("int8")).toEqual(expected);
    expect(analyzeAbiType("int16")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("int24")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("int32")).toEqual({ ...expected, length: 32 });
    expect(analyzeAbiType("int40")).toEqual({ ...expected, length: 40 });
    expect(analyzeAbiType("int48")).toEqual({ ...expected, length: 48 });
    expect(analyzeAbiType("int56")).toEqual({ ...expected, length: 56 });
    expect(analyzeAbiType("int64")).toEqual({ ...expected, length: 64 });
    expect(analyzeAbiType("int72")).toEqual({ ...expected, length: 72 });
    expect(analyzeAbiType("int80")).toEqual({ ...expected, length: 80 });
    expect(analyzeAbiType("int88")).toEqual({ ...expected, length: 88 });
    expect(analyzeAbiType("int96")).toEqual({ ...expected, length: 96 });
    expect(analyzeAbiType("int104")).toEqual({ ...expected, length: 104 });
    expect(analyzeAbiType("int112")).toEqual({ ...expected, length: 112 });
    expect(analyzeAbiType("int120")).toEqual({ ...expected, length: 120 });
    expect(analyzeAbiType("int128")).toEqual({ ...expected, length: 128 });
    expect(analyzeAbiType("int136")).toEqual({ ...expected, length: 136 });
    expect(analyzeAbiType("int144")).toEqual({ ...expected, length: 144 });
    expect(analyzeAbiType("int152")).toEqual({ ...expected, length: 152 });
    expect(analyzeAbiType("int160")).toEqual({ ...expected, length: 160 });
    expect(analyzeAbiType("int168")).toEqual({ ...expected, length: 168 });
    expect(analyzeAbiType("int176")).toEqual({ ...expected, length: 176 });
    expect(analyzeAbiType("int184")).toEqual({ ...expected, length: 184 });
    expect(analyzeAbiType("int192")).toEqual({ ...expected, length: 192 });
    expect(analyzeAbiType("int200")).toEqual({ ...expected, length: 200 });
    expect(analyzeAbiType("int208")).toEqual({ ...expected, length: 208 });
    expect(analyzeAbiType("int216")).toEqual({ ...expected, length: 216 });
    expect(analyzeAbiType("int224")).toEqual({ ...expected, length: 224 });
    expect(analyzeAbiType("int232")).toEqual({ ...expected, length: 232 });
    expect(analyzeAbiType("int240")).toEqual({ ...expected, length: 240 });
    expect(analyzeAbiType("int248")).toEqual({ ...expected, length: 248 });
    expect(analyzeAbiType("int256")).toEqual({ ...expected, length: 256 });
  });

  it("should parse static bytes types", () => {
    const expected = {
      baseType: "bytes",
      isArray: false,
      isDynamicLength: false,
      length: 1,
    };

    expect(analyzeAbiType("bytes1")).toEqual(expected);
    expect(analyzeAbiType("bytes2")).toEqual({ ...expected, length: 2 });
    expect(analyzeAbiType("bytes3")).toEqual({ ...expected, length: 3 });
    expect(analyzeAbiType("bytes4")).toEqual({ ...expected, length: 4 });
    expect(analyzeAbiType("bytes5")).toEqual({ ...expected, length: 5 });
    expect(analyzeAbiType("bytes6")).toEqual({ ...expected, length: 6 });
    expect(analyzeAbiType("bytes7")).toEqual({ ...expected, length: 7 });
    expect(analyzeAbiType("bytes8")).toEqual({ ...expected, length: 8 });
    expect(analyzeAbiType("bytes9")).toEqual({ ...expected, length: 9 });
    expect(analyzeAbiType("bytes10")).toEqual({ ...expected, length: 10 });
    expect(analyzeAbiType("bytes11")).toEqual({ ...expected, length: 11 });
    expect(analyzeAbiType("bytes12")).toEqual({ ...expected, length: 12 });
    expect(analyzeAbiType("bytes13")).toEqual({ ...expected, length: 13 });
    expect(analyzeAbiType("bytes14")).toEqual({ ...expected, length: 14 });
    expect(analyzeAbiType("bytes15")).toEqual({ ...expected, length: 15 });
    expect(analyzeAbiType("bytes16")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("bytes17")).toEqual({ ...expected, length: 17 });
    expect(analyzeAbiType("bytes18")).toEqual({ ...expected, length: 18 });
    expect(analyzeAbiType("bytes19")).toEqual({ ...expected, length: 19 });
    expect(analyzeAbiType("bytes20")).toEqual({ ...expected, length: 20 });
    expect(analyzeAbiType("bytes21")).toEqual({ ...expected, length: 21 });
    expect(analyzeAbiType("bytes22")).toEqual({ ...expected, length: 22 });
    expect(analyzeAbiType("bytes23")).toEqual({ ...expected, length: 23 });
    expect(analyzeAbiType("bytes24")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("bytes25")).toEqual({ ...expected, length: 25 });
    expect(analyzeAbiType("bytes26")).toEqual({ ...expected, length: 26 });
    expect(analyzeAbiType("bytes27")).toEqual({ ...expected, length: 27 });
    expect(analyzeAbiType("bytes28")).toEqual({ ...expected, length: 28 });
    expect(analyzeAbiType("bytes29")).toEqual({ ...expected, length: 29 });
    expect(analyzeAbiType("bytes30")).toEqual({ ...expected, length: 30 });
    expect(analyzeAbiType("bytes31")).toEqual({ ...expected, length: 31 });
    expect(analyzeAbiType("bytes32")).toEqual({ ...expected, length: 32 });
  });

  it("should parse static bool type", () => {
    const expected = {
      baseType: "bool",
      isArray: false,
      isDynamicLength: false,
      length: undefined,
    };

    expect(analyzeAbiType("bool")).toEqual(expected);
  });

  it("should parse static address type", () => {
    const expected = {
      baseType: "address",
      isArray: false,
      isDynamicLength: false,
      length: undefined,
    };

    expect(analyzeAbiType("address")).toEqual(expected);
  });

  it("should parse array of uint types", () => {
    const expected = {
      baseType: "uint",
      isArray: true,
      isDynamicLength: false,
      length: 8,
    };

    expect(analyzeAbiType("uint8[]")).toEqual(expected);
    expect(analyzeAbiType("uint16[]")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("uint24[]")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("uint32[]")).toEqual({ ...expected, length: 32 });
    expect(analyzeAbiType("uint40[]")).toEqual({ ...expected, length: 40 });
    expect(analyzeAbiType("uint48[]")).toEqual({ ...expected, length: 48 });
    expect(analyzeAbiType("uint56[]")).toEqual({ ...expected, length: 56 });
    expect(analyzeAbiType("uint64[]")).toEqual({ ...expected, length: 64 });
    expect(analyzeAbiType("uint72[]")).toEqual({ ...expected, length: 72 });
    expect(analyzeAbiType("uint80[]")).toEqual({ ...expected, length: 80 });
    expect(analyzeAbiType("uint88[]")).toEqual({ ...expected, length: 88 });
    expect(analyzeAbiType("uint96[]")).toEqual({ ...expected, length: 96 });
    expect(analyzeAbiType("uint104[]")).toEqual({ ...expected, length: 104 });
    expect(analyzeAbiType("uint112[]")).toEqual({ ...expected, length: 112 });
    expect(analyzeAbiType("uint120[]")).toEqual({ ...expected, length: 120 });
    expect(analyzeAbiType("uint128[]")).toEqual({ ...expected, length: 128 });
    expect(analyzeAbiType("uint136[]")).toEqual({ ...expected, length: 136 });
    expect(analyzeAbiType("uint144[]")).toEqual({ ...expected, length: 144 });
    expect(analyzeAbiType("uint152[]")).toEqual({ ...expected, length: 152 });
    expect(analyzeAbiType("uint160[]")).toEqual({ ...expected, length: 160 });
    expect(analyzeAbiType("uint168[]")).toEqual({ ...expected, length: 168 });
    expect(analyzeAbiType("uint176[]")).toEqual({ ...expected, length: 176 });
    expect(analyzeAbiType("uint184[]")).toEqual({ ...expected, length: 184 });
    expect(analyzeAbiType("uint192[]")).toEqual({ ...expected, length: 192 });
    expect(analyzeAbiType("uint200[]")).toEqual({ ...expected, length: 200 });
    expect(analyzeAbiType("uint208[]")).toEqual({ ...expected, length: 208 });
    expect(analyzeAbiType("uint216[]")).toEqual({ ...expected, length: 216 });
    expect(analyzeAbiType("uint224[]")).toEqual({ ...expected, length: 224 });
    expect(analyzeAbiType("uint232[]")).toEqual({ ...expected, length: 232 });
    expect(analyzeAbiType("uint240[]")).toEqual({ ...expected, length: 240 });
    expect(analyzeAbiType("uint248[]")).toEqual({ ...expected, length: 248 });
    expect(analyzeAbiType("uint256[]")).toEqual({ ...expected, length: 256 });
  });

  it("should parse array of int types", () => {
    const expected = {
      baseType: "int",
      isArray: true,
      isDynamicLength: false,
      length: 8,
    };

    expect(analyzeAbiType("int8[]")).toEqual(expected);
    expect(analyzeAbiType("int16[]")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("int24[]")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("int32[]")).toEqual({ ...expected, length: 32 });
    expect(analyzeAbiType("int40[]")).toEqual({ ...expected, length: 40 });
    expect(analyzeAbiType("int48[]")).toEqual({ ...expected, length: 48 });
    expect(analyzeAbiType("int56[]")).toEqual({ ...expected, length: 56 });
    expect(analyzeAbiType("int64[]")).toEqual({ ...expected, length: 64 });
    expect(analyzeAbiType("int72[]")).toEqual({ ...expected, length: 72 });
    expect(analyzeAbiType("int80[]")).toEqual({ ...expected, length: 80 });
    expect(analyzeAbiType("int88[]")).toEqual({ ...expected, length: 88 });
    expect(analyzeAbiType("int96[]")).toEqual({ ...expected, length: 96 });
    expect(analyzeAbiType("int104[]")).toEqual({ ...expected, length: 104 });
    expect(analyzeAbiType("int112[]")).toEqual({ ...expected, length: 112 });
    expect(analyzeAbiType("int120[]")).toEqual({ ...expected, length: 120 });
    expect(analyzeAbiType("int128[]")).toEqual({ ...expected, length: 128 });
    expect(analyzeAbiType("int136[]")).toEqual({ ...expected, length: 136 });
    expect(analyzeAbiType("int144[]")).toEqual({ ...expected, length: 144 });
    expect(analyzeAbiType("int152[]")).toEqual({ ...expected, length: 152 });
    expect(analyzeAbiType("int160[]")).toEqual({ ...expected, length: 160 });
    expect(analyzeAbiType("int168[]")).toEqual({ ...expected, length: 168 });
    expect(analyzeAbiType("int176[]")).toEqual({ ...expected, length: 176 });
    expect(analyzeAbiType("int184[]")).toEqual({ ...expected, length: 184 });
    expect(analyzeAbiType("int192[]")).toEqual({ ...expected, length: 192 });
    expect(analyzeAbiType("int200[]")).toEqual({ ...expected, length: 200 });
    expect(analyzeAbiType("int208[]")).toEqual({ ...expected, length: 208 });
    expect(analyzeAbiType("int216[]")).toEqual({ ...expected, length: 216 });
    expect(analyzeAbiType("int224[]")).toEqual({ ...expected, length: 224 });
    expect(analyzeAbiType("int232[]")).toEqual({ ...expected, length: 232 });
    expect(analyzeAbiType("int240[]")).toEqual({ ...expected, length: 240 });
    expect(analyzeAbiType("int248[]")).toEqual({ ...expected, length: 248 });
    expect(analyzeAbiType("int256[]")).toEqual({ ...expected, length: 256 });
  });

  it("should parse array of bytes types", () => {
    const expected = {
      baseType: "bytes",
      isArray: true,
      isDynamicLength: false,
      length: 1,
    };

    expect(analyzeAbiType("bytes1[]")).toEqual(expected);
    expect(analyzeAbiType("bytes2[]")).toEqual({ ...expected, length: 2 });
    expect(analyzeAbiType("bytes3[]")).toEqual({ ...expected, length: 3 });
    expect(analyzeAbiType("bytes4[]")).toEqual({ ...expected, length: 4 });
    expect(analyzeAbiType("bytes5[]")).toEqual({ ...expected, length: 5 });
    expect(analyzeAbiType("bytes6[]")).toEqual({ ...expected, length: 6 });
    expect(analyzeAbiType("bytes7[]")).toEqual({ ...expected, length: 7 });
    expect(analyzeAbiType("bytes8[]")).toEqual({ ...expected, length: 8 });
    expect(analyzeAbiType("bytes9[]")).toEqual({ ...expected, length: 9 });
    expect(analyzeAbiType("bytes10[]")).toEqual({ ...expected, length: 10 });
    expect(analyzeAbiType("bytes11[]")).toEqual({ ...expected, length: 11 });
    expect(analyzeAbiType("bytes12[]")).toEqual({ ...expected, length: 12 });
    expect(analyzeAbiType("bytes13[]")).toEqual({ ...expected, length: 13 });
    expect(analyzeAbiType("bytes14[]")).toEqual({ ...expected, length: 14 });
    expect(analyzeAbiType("bytes15[]")).toEqual({ ...expected, length: 15 });
    expect(analyzeAbiType("bytes16[]")).toEqual({ ...expected, length: 16 });
    expect(analyzeAbiType("bytes17[]")).toEqual({ ...expected, length: 17 });
    expect(analyzeAbiType("bytes18[]")).toEqual({ ...expected, length: 18 });
    expect(analyzeAbiType("bytes19[]")).toEqual({ ...expected, length: 19 });
    expect(analyzeAbiType("bytes20[]")).toEqual({ ...expected, length: 20 });
    expect(analyzeAbiType("bytes21[]")).toEqual({ ...expected, length: 21 });
    expect(analyzeAbiType("bytes22[]")).toEqual({ ...expected, length: 22 });
    expect(analyzeAbiType("bytes23[]")).toEqual({ ...expected, length: 23 });
    expect(analyzeAbiType("bytes24[]")).toEqual({ ...expected, length: 24 });
    expect(analyzeAbiType("bytes25[]")).toEqual({ ...expected, length: 25 });
    expect(analyzeAbiType("bytes26[]")).toEqual({ ...expected, length: 26 });
    expect(analyzeAbiType("bytes27[]")).toEqual({ ...expected, length: 27 });
    expect(analyzeAbiType("bytes28[]")).toEqual({ ...expected, length: 28 });
    expect(analyzeAbiType("bytes29[]")).toEqual({ ...expected, length: 29 });
    expect(analyzeAbiType("bytes30[]")).toEqual({ ...expected, length: 30 });
    expect(analyzeAbiType("bytes31[]")).toEqual({ ...expected, length: 31 });
    expect(analyzeAbiType("bytes32[]")).toEqual({ ...expected, length: 32 });
  });

  it("should parse array of bool type", () => {
    const expected = {
      baseType: "bool",
      isArray: true,
      isDynamicLength: false,
      length: undefined,
    };

    expect(analyzeAbiType("bool[]")).toEqual(expected);
  });

  it("should parse array of address type", () => {
    const expected = {
      baseType: "address",
      isArray: true,
      isDynamicLength: false,
      length: undefined,
    };

    expect(analyzeAbiType("address[]")).toEqual(expected);
  });

  it("should parse bytes type", () => {
    const expected = {
      baseType: "bytes",
      isArray: false,
      isDynamicLength: true,
      length: undefined,
    };

    expect(analyzeAbiType("bytes")).toEqual(expected);
  });

  it("should parse string type", () => {
    const expected = {
      baseType: "string",
      isArray: false,
      isDynamicLength: true,
      length: undefined,
    };

    expect(analyzeAbiType("string")).toEqual(expected);
  });
});
