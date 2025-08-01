import { describe, it, expect } from "vitest";
import { gameNotepadRoute } from "../gameNotepadRoute";
import { EnrichedRouteStep } from "../enrichRoute";

describe("gameNotepadRoute", () => {
  it("should return an empty array for an empty path", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toEqual([]);
  });

  it("should format a single step route correctly", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [
      {
        from: 30000142, // Jita
        to: 30000144, // Perimeter
        fromName: "Jita",
        toName: "Perimeter",
        type: "gate",
        distance: 0.5,
      },
    ];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("Jita → Perimeter");
    expect(result[0]).toContain("Gate: (x)→ SmartGate: []→ Jump: ly→");
    expect(result[0]).toContain('showinfo:5//30000142">Jita</a>');
    expect(result[0]).toContain(
      '(1)→ <a href="showinfo:5//30000144">Perimeter</a>'
    );
  });

  it("should handle a route with multiple gate steps", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [
      {
        from: 30000142, // Jita
        to: 30000144, // Perimeter
        fromName: "Jita",
        toName: "Perimeter",
        type: "gate",
        distance: 0.5,
      },
      {
        from: 30000144, // Perimeter
        to: 30000146, // Somewhere else
        fromName: "Perimeter",
        toName: "New Caldari",
        type: "gate",
        distance: 0.7,
      },
      {
        from: 30000146, // Somewhere else
        to: 30000148, // Final destination
        fromName: "New Caldari",
        toName: "Niyabainen",
        type: "gate",
        distance: 0.6,
      },
    ];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("Jita → Niyabainen");
    expect(result[0]).toContain('showinfo:5//30000142">Jita</a>');
    expect(result[0]).toContain(
      '(3)→ <a href="showinfo:5//30000148">Niyabainen</a>'
    );
  });

  it("should handle a route with mixed step types", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [
      {
        from: 30000142, // Jita
        to: 30000144, // Perimeter
        fromName: "Jita",
        toName: "Perimeter",
        type: "gate",
        distance: 0.5,
      },
      {
        from: 30000144, // Perimeter
        to: 30000146, // New Caldari
        fromName: "Perimeter",
        toName: "New Caldari",
        type: "jump",
        distance: 5.2,
      },
      {
        from: 30000146, // New Caldari
        to: 30000148, // Niyabainen
        fromName: "New Caldari",
        toName: "Niyabainen",
        type: "smartgate",
        id: "sg-1",
        itemId: "12345",
        name: "SmartGate Alpha",
        ownerName: "",
        distance: 0.6,
      },
    ];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("Jita → Niyabainen");
    expect(result[0]).toContain('showinfo:5//30000142">Jita</a>');
    expect(result[0]).toContain(
      '(1)→ <a href="showinfo:5//30000144">Perimeter</a>'
    );
    expect(result[0]).toContain(
      '5→ <a href="showinfo:5//30000146">New Caldari</a>'
    );
    expect(result[0]).toContain(
      '[<a href="showinfo:84955//12345">Smart…Alpha</a>]→ <a href="showinfo:5//30000148">Niyabainen</a>'
    );
  });

  it("should split the route into multiple parts if it exceeds MAX_INGAME_LENGTH", () => {
    // Arrange
    const pathFragment: EnrichedRouteStep[] = [
      {
        from: 30000142, // Jita
        to: 30000144, // Perimeter
        fromName: "Jita",
        toName: "Perimeter",
        type: "gate",
        distance: 0.5,
      },
      {
        from: 30000144, // Perimeter
        to: 30000146, // New Caldari
        fromName: "Perimeter",
        toName: "New Caldari",
        type: "jump",
        distance: 5.2,
      },
      {
        from: 30000146, // New Caldari
        to: 30000148, // Niyabainen
        fromName: "New Caldari",
        toName: "Niyabainen",
        type: "smartgate",
        id: "sg-1",
        itemId: "12345",
        name: "SmartGate Alpha",
        ownerName: "",
        distance: 0.6,
      },
    ];

    const generateLongPath = (): EnrichedRouteStep[] => {
      const path: EnrichedRouteStep[] = [];

      // Add enough steps to exceed MAX_INGAME_LENGTH
      for (let i = 0; i < 20; i++) {
        path.push(...pathFragment);
      }

      return path;
    };

    const path = generateLongPath();

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toContain("Jita → Niyabainen 1/3");
    expect(result[1]).toContain("Jita → Niyabainen 2/3");
    expect(result[2]).toContain("Jita → Niyabainen 3/3");
  });

  it("should handle smartgate steps correctly", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [
      {
        from: 30000142,
        to: 30000144,
        fromName: "Jita",
        toName: "Perimeter",
        type: "smartgate",
        id: "sg-123456",
        itemId: "654321",
        name: "Smart Gate XYZ",
        ownerName: "Test User",
        distance: 0.5,
      },
    ];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("Jita → Perimeter");
    expect(result[0]).toContain(
      '[<a href="showinfo:84955//654321">Smart…e XYZ</a>]→ <a href="showinfo:5//30000144">Perimeter</a>'
    );
  });

  it("should handle jump steps correctly", () => {
    // Arrange
    const path: EnrichedRouteStep[] = [
      {
        from: 30000142,
        to: 30000144,
        fromName: "Jita",
        toName: "Perimeter",
        type: "jump",
        distance: 5.75,
      },
    ];

    // Act
    const result = gameNotepadRoute(path);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("Jita → Perimeter");
    expect(result[0]).toContain(
      '6→ <a href="showinfo:5//30000144">Perimeter</a>'
    );
  });
});
