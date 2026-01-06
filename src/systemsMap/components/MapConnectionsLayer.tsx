import React from "react";

type Connection = {
  source: { id: string; x: number; y: number };
  target: { id: string; x: number; y: number };
};

type Direction = "up" | "down" | "left" | "right";

function getDirection(c: Connection): Direction {
  const dx = c.target.x - c.source.x;
  const dy = c.target.y - c.source.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

function getHalfCirclePath(
  cx: number,
  cy: number,
  r: number,
  direction: Direction
): string {
  switch (direction) {
    case "up":
      return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    case "down":
      return `M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy}`;
    case "left":
      return `M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r}`;
    case "right":
      return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`;
  }
}

interface MapConnectionsLayerProps {
  connections: Array<Connection>;
  width: number;
  height: number;
}

const MapConnectionsLayer: React.FC<MapConnectionsLayerProps> = ({
  connections,
  width,
  height,
}) => {
  if (connections.length === 0) {
    return null;
  }
  return (
    <svg width={width} height={height} style={{ top: 0, left: 0 }}>
      {connections.map((c) => {
        const direction = getDirection(c);
        const offsetY =
          direction === "up" ? -20 : direction === "down" ? 20 : 0;
        const offsetX =
          direction === "left" ? -40 : direction === "right" ? 40 : 0;
        const sourceX = c.source.x + width / 2 + offsetX;
        const sourceY = c.source.y + height / 2 + offsetY;
        const targetX = c.target.x + width / 2 + offsetX * -1;
        const targetY = c.target.y + height / 2 + offsetY * -1;
        const radius = 5;

        const oppositeDirection: Direction =
          direction === "up"
            ? "down"
            : direction === "down"
              ? "up"
              : direction === "left"
                ? "right"
                : "left";

        return (
          <g key={`${c.source.id}-${c.target.id}`}>
            <path
              d={getHalfCirclePath(sourceX, sourceY, radius, direction)}
              fill="gray"
            />
            <path
              d={getHalfCirclePath(targetX, targetY, radius, oppositeDirection)}
              fill="gray"
            />
            <line
              x1={sourceX}
              y1={sourceY}
              x2={targetX}
              y2={targetY}
              stroke={"gray"}
              strokeWidth="2"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default React.memo(MapConnectionsLayer);
