import { describe, it, expect, vi } from "vitest";
import { enrichRoute } from "../enrichRoute";
import { GetCalcPathFromToResponse } from "@/api/evedatacore";
import { createSolarSystemsIndex } from "../../solarSystemsIndex";

vi.mock("../../solarSystemsIndex");

describe("enrichRoute", () => {
  const SYSTEM_A_ID = 1001;
  const SYSTEM_B_ID = 1002;
  const SYSTEM_C_ID = 1003;
  const NONEXISTENT_ID = 9999;

  const solarSystemsIndex = createSolarSystemsIndex({});

  it("should enrich a route with basic information", () => {
    // Arrange
    const routeData: GetCalcPathFromToResponse["path"] = [
      {
        from: SYSTEM_A_ID,
        to: SYSTEM_B_ID,
        distance: 5,
        type: "jump",
      },
    ];

    // Act
    const result = enrichRoute(solarSystemsIndex, routeData);

    // Assert
    expect(result).toEqual({
      path: [
        {
          from: SYSTEM_A_ID,
          to: SYSTEM_B_ID,
          distance: 5.285004e-14,
          type: "jump",
          fromName: "Jita",
          toName: "Perimeter",
        },
      ],
      distance: 5.285004e-14,
      jumps: 1,
      jumpsDistance: 5.285004e-14,
      hops: 1,
    });
  });

  it("should handle routes with multiple jumps", () => {
    // Arrange
    const routeData: GetCalcPathFromToResponse["path"] = [
      {
        from: SYSTEM_A_ID,
        to: SYSTEM_B_ID,
        distance: 5,
        type: "jump",
      },
      {
        from: SYSTEM_B_ID,
        to: SYSTEM_C_ID,
        distance: 10,
        type: "jump",
      },
    ];

    // Act
    const result = enrichRoute(createSolarSystemsIndex({}), routeData);

    // Assert
    expect(result.path.length).toBe(2);
    expect(result.jumps).toBe(2);
    expect(result.hops).toBe(2);
    expect(result.jumpsDistance).toBe(1.5855012e-13);
    expect(result.distance).toBe(1.5855012e-13);
  });

  it("should handle routes with mixed jump types", () => {
    // Arrange
    const routeData: GetCalcPathFromToResponse["path"] = [
      {
        from: SYSTEM_A_ID,
        to: SYSTEM_B_ID,
        distance: 5,
        type: "jump",
      },
      {
        from: SYSTEM_B_ID,
        to: SYSTEM_C_ID,
        distance: 10,
        type: "gate",
      },
    ];

    // Act
    const result = enrichRoute(solarSystemsIndex, routeData);

    // Assert
    expect(result.path.length).toBe(2);
    expect(result.jumps).toBe(1);
    expect(result.hops).toBe(2);
    // Only the first jump adds to jumpsDistance
    expect(result.jumpsDistance).toBe(5.285004e-14);
    // But both contribute to total distance
    expect(result.distance).toBe(1.5855012e-13);
  });

  it("should handle empty route data", () => {
    // Arrange
    const routeData: GetCalcPathFromToResponse["path"] = [];

    // Act
    const result = enrichRoute(solarSystemsIndex, routeData);

    // Assert
    expect(result.path).toEqual([]);
    expect(result.jumps).toBe(0);
    expect(result.jumpsDistance).toBe(0);
    expect(result.distance).toBe(0);
    expect(result.hops).toBe(0);
  });

  it("should skip steps where solar systems cannot be found", () => {
    // Arrange
    const routeData: GetCalcPathFromToResponse["path"] = [
      {
        from: SYSTEM_B_ID,
        to: SYSTEM_C_ID,
        distance: 10,
        type: "gate",
      },
      {
        from: SYSTEM_A_ID,
        to: NONEXISTENT_ID, // Non-existent system
        distance: 5,
        type: "jump",
      },
    ];

    // Act
    const result = enrichRoute(solarSystemsIndex, routeData);

    // Assert
    expect(result.path).toEqual([
      {
        distance: 1.0570008e-13,
        from: 1002,
        fromName: "Perimeter",
        to: 1003,
        toName: "Dodixie",
        type: "gate",
      },
    ]);
    expect(result.jumps).toBe(0);
    expect(result.jumpsDistance).toBe(0);
    expect(result.distance).toBe(1.0570008e-13);
    expect(result.hops).toBe(1);
  });
});
