import React from "react";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import SystemNode from "./components/SystemNode";
import { GraphNode } from "./common";
import MapConnectionsLayer from "./components/MapConnectionsLayer";
import { mapSelectors, useMapSelector } from "./state";

interface MapGraphProps {
  onNodeClick?: (node: GraphNode) => void;
  onNodeOver?: (node: GraphNode | null) => void;
}

const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 1200;

const MapGraph: React.FC<MapGraphProps> = ({ onNodeClick, onNodeOver }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const centerNodeRef = React.useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const debouncedSize = useDebounce(size, 100);
  const systemId = useMapSelector(mapSelectors.selectSystemId);
  const nodes = useMapSelector(mapSelectors.selectNodes);
  const backgroundLayer = useMapSelector(mapSelectors.selectBackgroundLayer);

  const [dragging, setDragging] = React.useState(false);
  const dragStartRef = React.useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

  React.useEffect(() => {
    if (centerNodeRef.current) {
      containerRef.current?.scrollTo({
        top:
          centerNodeRef.current.offsetTop -
          (containerRef.current?.offsetHeight || 0) / 2,
        left:
          centerNodeRef.current.offsetLeft -
          (containerRef.current?.offsetWidth || 0) / 2,
        behavior: "instant",
      });
    }
  }, [debouncedSize, nodes]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !dragStartRef.current || !containerRef.current) return;
      e.preventDefault();
      const deltaX = dragStartRef.current.x - e.clientX;
      const deltaY = dragStartRef.current.y - e.clientY;
      containerRef.current.scrollLeft =
        dragStartRef.current.scrollLeft + deltaX;
      containerRef.current.scrollTop = dragStartRef.current.scrollTop + deltaY;
    },
    [dragging]
  );

  const handleMouseUp = React.useCallback(() => {
    setDragging(false);
    dragStartRef.current = null;
  }, []);

  return (
    <div ref={containerRef} style={{ overflow: "hidden", flexGrow: 1 }}>
      <div
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
          position: "relative",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <MapConnectionsLayer
          connections={backgroundLayer}
          nodes={nodes}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
        />
        {Object.values(nodes).map((node) => {
          if (node.x === undefined || node.y === undefined) {
            return null;
          }
          return (
            <SystemNode
              key={node.id}
              nodeId={node.id}
              x={node.x + GRAPH_WIDTH / 2}
              y={node.y + GRAPH_HEIGHT / 2}
              onClick={() => {
                onNodeClick?.(node);
              }}
              onMouseOver={() => {
                onNodeOver?.(node);
              }}
              onMouseLeave={() => {
                onNodeOver?.(null);
              }}
              center={node.id === systemId}
              ref={node.id === systemId ? centerNodeRef : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MapGraph;
