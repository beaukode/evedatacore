import React from "react";

interface MapConnectionsLayerProps {
  connections: Array<{
    source: { id: string; x: number; y: number };
    target: { id: string; x: number; y: number };
  }>;
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
        return (
          <g key={`${c.source.id}-${c.target.id}`}>
            <line
              x1={c.source.x + width / 2}
              y1={c.source.y + height / 2}
              x2={c.target.x + width / 2}
              y2={c.target.y + height / 2}
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
