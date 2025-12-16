import React from "react";
import * as d3 from "d3-force";
import { keyBy } from "lodash-es";
import TextNode from "./nodes/TextNode";
import { GraphConnnection, GraphNode } from "./common";

interface SystemNeighborsMapGraphProps {
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

type SimulationNodeMap = Record<string, SimulationNode>;

const NEIGHBOR_STRENGTH = 0.2;
const CENTER_STRENGTH = 1.0;
const DISTANCE_SCALE = 4;
const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 1200;

const SystemNeighborsMapGraph: React.FC<SystemNeighborsMapGraphProps> = ({
  nodes,
  connections,
  onNodeClick,
  onNodeOver,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const centerNodeRef = React.useRef<HTMLDivElement>(null);

  const [simulationNodes, setSimulationNodes] =
    React.useState<SimulationNodeMap>({});
  const [centerNode, setCenterNode] = React.useState<SimulationNode>();

  const [dragging, setDragging] = React.useState(false);

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

    setCenterNode(simulationNodes.pop()); // last node is the center node
    setSimulationNodes(keyBy(simulationNodes, "id"));
  }, [nodes]);

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
  }, [centerNode]);

  return (
    <div ref={containerRef} style={{ overflow: "hidden", flexGrow: 1 }}>
      <div
        style={{
          width: GRAPH_WIDTH,
          height: GRAPH_HEIGHT,
          position: "relative",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <svg
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          style={{ top: 0, left: 0 }}
        >
          {connections.map((c) => {
            const sourceNode =
              centerNode?.id === c.source
                ? centerNode
                : simulationNodes[c.source];
            const targetNode =
              centerNode?.id === c.target
                ? centerNode
                : simulationNodes[c.target];
            if (!sourceNode || !targetNode) {
              return null;
            }
            return (
              <g key={`${sourceNode.id}-${targetNode.id}`}>
                <line
                  x1={sourceNode.x + GRAPH_WIDTH / 2}
                  y1={sourceNode.y + GRAPH_HEIGHT / 2}
                  x2={targetNode.x + GRAPH_WIDTH / 2}
                  y2={targetNode.y + GRAPH_HEIGHT / 2}
                  stroke={"gray"}
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
        {Object.values(simulationNodes).map((node) => {
          return (
            <TextNode
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
            />
          );
        })}
        {centerNode && (
          <TextNode
            nodeId={centerNode.id}
            ref={centerNodeRef}
            x={centerNode.x + GRAPH_WIDTH / 2}
            y={centerNode.y + GRAPH_HEIGHT / 2}
            onClick={() => {
              onNodeClick?.(centerNode);
            }}
            onMouseOver={() => {
              onNodeOver?.(centerNode);
            }}
            onMouseLeave={() => {
              onNodeOver?.(null);
            }}
            center={true}
          />
        )}
      </div>
    </div>
  );
};

export default SystemNeighborsMapGraph;
