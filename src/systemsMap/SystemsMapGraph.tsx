import React from "react";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import * as d3 from "d3-force";
import { keyBy } from "lodash-es";
import SystemNode from "./components/SystemNode";
import { GraphConnnection, GraphNode } from "./common";
import MapConnectionsLayer from "./components/MapConnectionsLayer";

interface SystemsMapGraphProps {
  nodes: GraphNode[];
  connections: GraphConnnection[];
  onNodeClick?: (node: SimulationNode) => void;
  onNodeOver?: (node: GraphNode | null) => void;
}

type SimulationNode = GraphNode & {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type SimulationLink = {
  source: SimulationNode;
  target: SimulationNode;
  distance: number;
  strength: number;
};

type SimulationConnection = {
  source: SimulationNode;
  target: SimulationNode;
};

const NEIGHBOR_STRENGTH = 0.2;
const CENTER_STRENGTH = 1.0;
const DISTANCE_SCALE = 4;
const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 1200;

const SystemsMapGraph: React.FC<SystemsMapGraphProps> = ({
  nodes,
  connections,
  onNodeClick,
  onNodeOver,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const centerNodeRef = React.useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const debouncedSize = useDebounce(size, 100);

  const [simulationNodes, setSimulationNodes] = React.useState<
    SimulationNode[]
  >([]);
  const [simulationConnections, setSimulationConnections] = React.useState<
    SimulationConnection[]
  >([]);

  const [dragging, setDragging] = React.useState(false);
  const dragStartRef = React.useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

  React.useEffect(() => {
    const simulationNodes: SimulationNode[] = nodes.map((node) => ({
      ...node,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }));
    const centerNode = simulationNodes[simulationNodes.length - 1];

    if (!centerNode) {
      return;
    }

    let links: SimulationLink[] = simulationNodes.map((node) => ({
      target: node,
      source: centerNode,
      distance: node.d,
      strength: CENTER_STRENGTH,
    }));

    let prev: SimulationNode | undefined;
    for (const node of simulationNodes) {
      if (prev) {
        links.push({
          source: prev,
          target: node,
          distance: prev.n,
          strength: NEIGHBOR_STRENGTH,
        });
      }
      prev = node;
    }

    // Scale the distances to be between 10 and 100
    const maxDistance = Math.max(...links.map((link) => link.distance));
    const minDistance = Math.min(...links.map((link) => link.distance));
    if (maxDistance !== minDistance) {
      links = links.map((link) => ({
        ...link,
        distance: Math.max(
          10,
          ((link.distance - minDistance) / (maxDistance - minDistance)) * 100
        ),
      }));
    }

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force("center", d3.forceCenter(0, 0))
      .force(
        "link",
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .distance((d) => d.distance * DISTANCE_SCALE)
          .id((d) => d.id)
          .strength((d) => d.strength)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("collide", d3.forceCollide().radius(44).strength(0.1))
      .force("bounds", () => {
        for (const node of simulationNodes) {
          node.x = Math.max(
            (GRAPH_WIDTH / 2) * -1,
            Math.min(GRAPH_WIDTH / 2, node.x)
          );
          node.y = Math.max(
            (GRAPH_HEIGHT / 2) * -1,
            Math.min(GRAPH_HEIGHT / 2, node.y)
          );
        }
      })
      .stop();

    const simulationSteps = Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
    );
    simulation.tick(simulationSteps);

    const simulationNodesMap = keyBy(simulationNodes, "id");
    const simulationConnections: SimulationConnection[] = [];
    for (const connection of connections) {
      const sourceNode = simulationNodesMap[connection.source];
      const targetNode = simulationNodesMap[connection.target];
      if (sourceNode && targetNode) {
        simulationConnections.push({
          source: sourceNode,
          target: targetNode,
        });
      }
    }
    setSimulationConnections(simulationConnections);
    setSimulationNodes(simulationNodes);
  }, [nodes, connections]);

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
  }, [debouncedSize]);

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
          connections={simulationConnections}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
        />
        {simulationNodes.map((node, index) => {
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
              center={index === simulationNodes.length - 1}
              ref={
                index === simulationNodes.length - 1 ? centerNodeRef : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default SystemsMapGraph;
