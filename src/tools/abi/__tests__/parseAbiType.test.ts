import { describe, it, expect } from "vitest";
import { parseAbiType } from "../parseAbiType";

describe("parseAbiType", () => {
  it("should parse static uint types", () => {
    const expected = {
      baseType: "uint",
      isArray: false,
      isDynamicLength: false,
      length: 8,
    };

    expect(parseAbiType("uint8")).toEqual(expected);
    expect(parseAbiType("uint16")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("uint24")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("uint32")).toEqual({ ...expected, length: 32 });
    expect(parseAbiType("uint40")).toEqual({ ...expected, length: 40 });
    expect(parseAbiType("uint48")).toEqual({ ...expected, length: 48 });
    expect(parseAbiType("uint56")).toEqual({ ...expected, length: 56 });
    expect(parseAbiType("uint64")).toEqual({ ...expected, length: 64 });
    expect(parseAbiType("uint72")).toEqual({ ...expected, length: 72 });
    expect(parseAbiType("uint80")).toEqual({ ...expected, length: 80 });
    expect(parseAbiType("uint88")).toEqual({ ...expected, length: 88 });
    expect(parseAbiType("uint96")).toEqual({ ...expected, length: 96 });
    expect(parseAbiType("uint104")).toEqual({ ...expected, length: 104 });
    expect(parseAbiType("uint112")).toEqual({ ...expected, length: 112 });
    expect(parseAbiType("uint120")).toEqual({ ...expected, length: 120 });
    expect(parseAbiType("uint128")).toEqual({ ...expected, length: 128 });
    expect(parseAbiType("uint136")).toEqual({ ...expected, length: 136 });
    expect(parseAbiType("uint144")).toEqual({ ...expected, length: 144 });
    expect(parseAbiType("uint152")).toEqual({ ...expected, length: 152 });
    expect(parseAbiType("uint160")).toEqual({ ...expected, length: 160 });
    expect(parseAbiType("uint168")).toEqual({ ...expected, length: 168 });
    expect(parseAbiType("uint176")).toEqual({ ...expected, length: 176 });
    expect(parseAbiType("uint184")).toEqual({ ...expected, length: 184 });
    expect(parseAbiType("uint192")).toEqual({ ...expected, length: 192 });
    expect(parseAbiType("uint200")).toEqual({ ...expected, length: 200 });
    expect(parseAbiType("uint208")).toEqual({ ...expected, length: 208 });
    expect(parseAbiType("uint216")).toEqual({ ...expected, length: 216 });
    expect(parseAbiType("uint224")).toEqual({ ...expected, length: 224 });
    expect(parseAbiType("uint232")).toEqual({ ...expected, length: 232 });
    expect(parseAbiType("uint240")).toEqual({ ...expected, length: 240 });
    expect(parseAbiType("uint248")).toEqual({ ...expected, length: 248 });
    expect(parseAbiType("uint256")).toEqual({ ...expected, length: 256 });
  });

  it("should parse static int types", () => {
    const expected = {
      baseType: "int",
      isArray: false,
      isDynamicLength: false,
      length: 8,
    };

    expect(parseAbiType("int8")).toEqual(expected);
    expect(parseAbiType("int16")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("int24")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("int32")).toEqual({ ...expected, length: 32 });
    expect(parseAbiType("int40")).toEqual({ ...expected, length: 40 });
    expect(parseAbiType("int48")).toEqual({ ...expected, length: 48 });
    expect(parseAbiType("int56")).toEqual({ ...expected, length: 56 });
    expect(parseAbiType("int64")).toEqual({ ...expected, length: 64 });
    expect(parseAbiType("int72")).toEqual({ ...expected, length: 72 });
    expect(parseAbiType("int80")).toEqual({ ...expected, length: 80 });
    expect(parseAbiType("int88")).toEqual({ ...expected, length: 88 });
    expect(parseAbiType("int96")).toEqual({ ...expected, length: 96 });
    expect(parseAbiType("int104")).toEqual({ ...expected, length: 104 });
    expect(parseAbiType("int112")).toEqual({ ...expected, length: 112 });
    expect(parseAbiType("int120")).toEqual({ ...expected, length: 120 });
    expect(parseAbiType("int128")).toEqual({ ...expected, length: 128 });
    expect(parseAbiType("int136")).toEqual({ ...expected, length: 136 });
    expect(parseAbiType("int144")).toEqual({ ...expected, length: 144 });
    expect(parseAbiType("int152")).toEqual({ ...expected, length: 152 });
    expect(parseAbiType("int160")).toEqual({ ...expected, length: 160 });
    expect(parseAbiType("int168")).toEqual({ ...expected, length: 168 });
    expect(parseAbiType("int176")).toEqual({ ...expected, length: 176 });
    expect(parseAbiType("int184")).toEqual({ ...expected, length: 184 });
    expect(parseAbiType("int192")).toEqual({ ...expected, length: 192 });
    expect(parseAbiType("int200")).toEqual({ ...expected, length: 200 });
    expect(parseAbiType("int208")).toEqual({ ...expected, length: 208 });
    expect(parseAbiType("int216")).toEqual({ ...expected, length: 216 });
    expect(parseAbiType("int224")).toEqual({ ...expected, length: 224 });
    expect(parseAbiType("int232")).toEqual({ ...expected, length: 232 });
    expect(parseAbiType("int240")).toEqual({ ...expected, length: 240 });
    expect(parseAbiType("int248")).toEqual({ ...expected, length: 248 });
    expect(parseAbiType("int256")).toEqual({ ...expected, length: 256 });
  });

  it("should parse static bytes types", () => {
    const expected = {
      baseType: "bytes",
      isArray: false,
      isDynamicLength: false,
      length: 1,
    };

    expect(parseAbiType("bytes1")).toEqual(expected);
    expect(parseAbiType("bytes2")).toEqual({ ...expected, length: 2 });
    expect(parseAbiType("bytes3")).toEqual({ ...expected, length: 3 });
    expect(parseAbiType("bytes4")).toEqual({ ...expected, length: 4 });
    expect(parseAbiType("bytes5")).toEqual({ ...expected, length: 5 });
    expect(parseAbiType("bytes6")).toEqual({ ...expected, length: 6 });
    expect(parseAbiType("bytes7")).toEqual({ ...expected, length: 7 });
    expect(parseAbiType("bytes8")).toEqual({ ...expected, length: 8 });
    expect(parseAbiType("bytes9")).toEqual({ ...expected, length: 9 });
    expect(parseAbiType("bytes10")).toEqual({ ...expected, length: 10 });
    expect(parseAbiType("bytes11")).toEqual({ ...expected, length: 11 });
    expect(parseAbiType("bytes12")).toEqual({ ...expected, length: 12 });
    expect(parseAbiType("bytes13")).toEqual({ ...expected, length: 13 });
    expect(parseAbiType("bytes14")).toEqual({ ...expected, length: 14 });
    expect(parseAbiType("bytes15")).toEqual({ ...expected, length: 15 });
    expect(parseAbiType("bytes16")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("bytes17")).toEqual({ ...expected, length: 17 });
    expect(parseAbiType("bytes18")).toEqual({ ...expected, length: 18 });
    expect(parseAbiType("bytes19")).toEqual({ ...expected, length: 19 });
    expect(parseAbiType("bytes20")).toEqual({ ...expected, length: 20 });
    expect(parseAbiType("bytes21")).toEqual({ ...expected, length: 21 });
    expect(parseAbiType("bytes22")).toEqual({ ...expected, length: 22 });
    expect(parseAbiType("bytes23")).toEqual({ ...expected, length: 23 });
    expect(parseAbiType("bytes24")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("bytes25")).toEqual({ ...expected, length: 25 });
    expect(parseAbiType("bytes26")).toEqual({ ...expected, length: 26 });
    expect(parseAbiType("bytes27")).toEqual({ ...expected, length: 27 });
    expect(parseAbiType("bytes28")).toEqual({ ...expected, length: 28 });
    expect(parseAbiType("bytes29")).toEqual({ ...expected, length: 29 });
    expect(parseAbiType("bytes30")).toEqual({ ...expected, length: 30 });
    expect(parseAbiType("bytes31")).toEqual({ ...expected, length: 31 });
    expect(parseAbiType("bytes32")).toEqual({ ...expected, length: 32 });
  });

  it("should parse static bool type", () => {
    const expected = {
      baseType: "bool",
      isArray: false,
      isDynamicLength: false,
      length: undefined,
    };

    expect(parseAbiType("bool")).toEqual(expected);
  });

  it("should parse static address type", () => {
    const expected = {
      baseType: "address",
      isArray: false,
      isDynamicLength: false,
      length: undefined,
    };

    expect(parseAbiType("address")).toEqual(expected);
  });

  it("should parse array of uint types", () => {
    const expected = {
      baseType: "uint",
      isArray: true,
      isDynamicLength: false,
      length: 8,
    };

    expect(parseAbiType("uint8[]")).toEqual(expected);
    expect(parseAbiType("uint16[]")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("uint24[]")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("uint32[]")).toEqual({ ...expected, length: 32 });
    expect(parseAbiType("uint40[]")).toEqual({ ...expected, length: 40 });
    expect(parseAbiType("uint48[]")).toEqual({ ...expected, length: 48 });
    expect(parseAbiType("uint56[]")).toEqual({ ...expected, length: 56 });
    expect(parseAbiType("uint64[]")).toEqual({ ...expected, length: 64 });
    expect(parseAbiType("uint72[]")).toEqual({ ...expected, length: 72 });
    expect(parseAbiType("uint80[]")).toEqual({ ...expected, length: 80 });
    expect(parseAbiType("uint88[]")).toEqual({ ...expected, length: 88 });
    expect(parseAbiType("uint96[]")).toEqual({ ...expected, length: 96 });
    expect(parseAbiType("uint104[]")).toEqual({ ...expected, length: 104 });
    expect(parseAbiType("uint112[]")).toEqual({ ...expected, length: 112 });
    expect(parseAbiType("uint120[]")).toEqual({ ...expected, length: 120 });
    expect(parseAbiType("uint128[]")).toEqual({ ...expected, length: 128 });
    expect(parseAbiType("uint136[]")).toEqual({ ...expected, length: 136 });
    expect(parseAbiType("uint144[]")).toEqual({ ...expected, length: 144 });
    expect(parseAbiType("uint152[]")).toEqual({ ...expected, length: 152 });
    expect(parseAbiType("uint160[]")).toEqual({ ...expected, length: 160 });
    expect(parseAbiType("uint168[]")).toEqual({ ...expected, length: 168 });
    expect(parseAbiType("uint176[]")).toEqual({ ...expected, length: 176 });
    expect(parseAbiType("uint184[]")).toEqual({ ...expected, length: 184 });
    expect(parseAbiType("uint192[]")).toEqual({ ...expected, length: 192 });
    expect(parseAbiType("uint200[]")).toEqual({ ...expected, length: 200 });
    expect(parseAbiType("uint208[]")).toEqual({ ...expected, length: 208 });
    expect(parseAbiType("uint216[]")).toEqual({ ...expected, length: 216 });
    expect(parseAbiType("uint224[]")).toEqual({ ...expected, length: 224 });
    expect(parseAbiType("uint232[]")).toEqual({ ...expected, length: 232 });
    expect(parseAbiType("uint240[]")).toEqual({ ...expected, length: 240 });
    expect(parseAbiType("uint248[]")).toEqual({ ...expected, length: 248 });
    expect(parseAbiType("uint256[]")).toEqual({ ...expected, length: 256 });
  });

  it("should parse array of int types", () => {
    const expected = {
      baseType: "int",
      isArray: true,
      isDynamicLength: false,
      length: 8,
    };

    expect(parseAbiType("int8[]")).toEqual(expected);
    expect(parseAbiType("int16[]")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("int24[]")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("int32[]")).toEqual({ ...expected, length: 32 });
    expect(parseAbiType("int40[]")).toEqual({ ...expected, length: 40 });
    expect(parseAbiType("int48[]")).toEqual({ ...expected, length: 48 });
    expect(parseAbiType("int56[]")).toEqual({ ...expected, length: 56 });
    expect(parseAbiType("int64[]")).toEqual({ ...expected, length: 64 });
    expect(parseAbiType("int72[]")).toEqual({ ...expected, length: 72 });
    expect(parseAbiType("int80[]")).toEqual({ ...expected, length: 80 });
    expect(parseAbiType("int88[]")).toEqual({ ...expected, length: 88 });
    expect(parseAbiType("int96[]")).toEqual({ ...expected, length: 96 });
    expect(parseAbiType("int104[]")).toEqual({ ...expected, length: 104 });
    expect(parseAbiType("int112[]")).toEqual({ ...expected, length: 112 });
    expect(parseAbiType("int120[]")).toEqual({ ...expected, length: 120 });
    expect(parseAbiType("int128[]")).toEqual({ ...expected, length: 128 });
    expect(parseAbiType("int136[]")).toEqual({ ...expected, length: 136 });
    expect(parseAbiType("int144[]")).toEqual({ ...expected, length: 144 });
    expect(parseAbiType("int152[]")).toEqual({ ...expected, length: 152 });
    expect(parseAbiType("int160[]")).toEqual({ ...expected, length: 160 });
    expect(parseAbiType("int168[]")).toEqual({ ...expected, length: 168 });
    expect(parseAbiType("int176[]")).toEqual({ ...expected, length: 176 });
    expect(parseAbiType("int184[]")).toEqual({ ...expected, length: 184 });
    expect(parseAbiType("int192[]")).toEqual({ ...expected, length: 192 });
    expect(parseAbiType("int200[]")).toEqual({ ...expected, length: 200 });
    expect(parseAbiType("int208[]")).toEqual({ ...expected, length: 208 });
    expect(parseAbiType("int216[]")).toEqual({ ...expected, length: 216 });
    expect(parseAbiType("int224[]")).toEqual({ ...expected, length: 224 });
    expect(parseAbiType("int232[]")).toEqual({ ...expected, length: 232 });
    expect(parseAbiType("int240[]")).toEqual({ ...expected, length: 240 });
    expect(parseAbiType("int248[]")).toEqual({ ...expected, length: 248 });
    expect(parseAbiType("int256[]")).toEqual({ ...expected, length: 256 });
  });

  it("should parse array of bytes types", () => {
    const expected = {
      baseType: "bytes",
      isArray: true,
      isDynamicLength: false,
      length: 1,
    };

    expect(parseAbiType("bytes1[]")).toEqual(expected);
    expect(parseAbiType("bytes2[]")).toEqual({ ...expected, length: 2 });
    expect(parseAbiType("bytes3[]")).toEqual({ ...expected, length: 3 });
    expect(parseAbiType("bytes4[]")).toEqual({ ...expected, length: 4 });
    expect(parseAbiType("bytes5[]")).toEqual({ ...expected, length: 5 });
    expect(parseAbiType("bytes6[]")).toEqual({ ...expected, length: 6 });
    expect(parseAbiType("bytes7[]")).toEqual({ ...expected, length: 7 });
    expect(parseAbiType("bytes8[]")).toEqual({ ...expected, length: 8 });
    expect(parseAbiType("bytes9[]")).toEqual({ ...expected, length: 9 });
    expect(parseAbiType("bytes10[]")).toEqual({ ...expected, length: 10 });
    expect(parseAbiType("bytes11[]")).toEqual({ ...expected, length: 11 });
    expect(parseAbiType("bytes12[]")).toEqual({ ...expected, length: 12 });
    expect(parseAbiType("bytes13[]")).toEqual({ ...expected, length: 13 });
    expect(parseAbiType("bytes14[]")).toEqual({ ...expected, length: 14 });
    expect(parseAbiType("bytes15[]")).toEqual({ ...expected, length: 15 });
    expect(parseAbiType("bytes16[]")).toEqual({ ...expected, length: 16 });
    expect(parseAbiType("bytes17[]")).toEqual({ ...expected, length: 17 });
    expect(parseAbiType("bytes18[]")).toEqual({ ...expected, length: 18 });
    expect(parseAbiType("bytes19[]")).toEqual({ ...expected, length: 19 });
    expect(parseAbiType("bytes20[]")).toEqual({ ...expected, length: 20 });
    expect(parseAbiType("bytes21[]")).toEqual({ ...expected, length: 21 });
    expect(parseAbiType("bytes22[]")).toEqual({ ...expected, length: 22 });
    expect(parseAbiType("bytes23[]")).toEqual({ ...expected, length: 23 });
    expect(parseAbiType("bytes24[]")).toEqual({ ...expected, length: 24 });
    expect(parseAbiType("bytes25[]")).toEqual({ ...expected, length: 25 });
    expect(parseAbiType("bytes26[]")).toEqual({ ...expected, length: 26 });
    expect(parseAbiType("bytes27[]")).toEqual({ ...expected, length: 27 });
    expect(parseAbiType("bytes28[]")).toEqual({ ...expected, length: 28 });
    expect(parseAbiType("bytes29[]")).toEqual({ ...expected, length: 29 });
    expect(parseAbiType("bytes30[]")).toEqual({ ...expected, length: 30 });
    expect(parseAbiType("bytes31[]")).toEqual({ ...expected, length: 31 });
    expect(parseAbiType("bytes32[]")).toEqual({ ...expected, length: 32 });
  });

  it("should parse array of bool type", () => {
    const expected = {
      baseType: "bool",
      isArray: true,
      isDynamicLength: false,
      length: undefined,
    };

    expect(parseAbiType("bool[]")).toEqual(expected);
  });

  it("should parse array of address type", () => {
    const expected = {
      baseType: "address",
      isArray: true,
      isDynamicLength: false,
      length: undefined,
    };

    expect(parseAbiType("address[]")).toEqual(expected);
  });

  it("should parse bytes type", () => {
    const expected = {
      baseType: "bytes",
      isArray: false,
      isDynamicLength: true,
      length: undefined,
    };

    expect(parseAbiType("bytes")).toEqual(expected);
  });

  it("should parse string type", () => {
    const expected = {
      baseType: "string",
      isArray: false,
      isDynamicLength: true,
      length: undefined,
    };

    expect(parseAbiType("string")).toEqual(expected);
  });
});
