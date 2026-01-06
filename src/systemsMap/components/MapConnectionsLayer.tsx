import React from "react";

type Connection = {
  source: { id: string; x: number; y: number };
  target: { id: string; x: number; y: number };
};

type Direction = "up" | "down" | "left" | "right";

type ComputedConnection = {
  id: string;
  direction: Direction;
  oppositeDirection: Direction;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

function getDirection(c: Connection): Direction {
  const dx = c.target.x - c.source.x;
  const dy = c.target.y - c.source.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
  }
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
  const computedConnections = React.useMemo<ComputedConnection[]>(() => {
    return connections.map((c) => {
      const id = `${c.source.id}-${c.target.id}`;
      const direction = getDirection(c);
      const oppositeDirection = getOppositeDirection(direction);
      const offsetY = direction === "up" ? -20 : direction === "down" ? 20 : 0;
      const offsetX =
        direction === "left" ? -40 : direction === "right" ? 40 : 0;
      const sourceX = c.source.x + width / 2 + offsetX;
      const sourceY = c.source.y + height / 2 + offsetY;
      const targetX = c.target.x + width / 2 + offsetX * -1;
      const targetY = c.target.y + height / 2 + offsetY * -1;

      return {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        direction,
        oppositeDirection,
      };
    });
  }, [connections, width, height]);

  if (computedConnections.length === 0) {
    return null;
  }

  const radius = 5;

  return (
    <svg width={width} height={height} style={{ top: 0, left: 0 }}>
      <defs>
        {computedConnections.map((computed) => (
          <linearGradient
            key={computed.id}
            id={`gradient-${computed.id}`}
            gradientUnits="userSpaceOnUse"
            x1={computed.sourceX}
            y1={computed.sourceY}
            x2={computed.targetX}
            y2={computed.targetY}
          >
            <stop offset="0%" stopColor="gray" stopOpacity="1" />
            <stop offset="50%" stopColor="gray" stopOpacity="0.2" />
            <stop offset="100%" stopColor="gray" stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>
      {computedConnections.map((computed) => (
        <g key={computed.id}>
          <path
            d={getHalfCirclePath(
              computed.sourceX,
              computed.sourceY,
              radius,
              computed.direction
            )}
            fill="gray"
          />
          <path
            d={getHalfCirclePath(
              computed.targetX,
              computed.targetY,
              radius,
              computed.oppositeDirection
            )}
            fill="gray"
          />
          <line
            x1={computed.sourceX}
            y1={computed.sourceY}
            x2={computed.targetX}
            y2={computed.targetY}
            stroke={`url(#gradient-${computed.id})`}
            strokeWidth="3"
          />
        </g>
      ))}
    </svg>
  );
};

export default React.memo(MapConnectionsLayer);
