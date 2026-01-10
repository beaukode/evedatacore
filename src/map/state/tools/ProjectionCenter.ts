import { put, select } from "typed-redux-saga";
import * as d3 from "d3-force";
import { keyBy } from "lodash";
import { mapActions, mapSelectors } from "../";
import { GraphNode } from "../../common";

type SimulationLink = {
  source: GraphNode;
  target: GraphNode;
  distance: number;
  strength: number;
};

const NEIGHBOR_STRENGTH = 0.2;
const CENTER_STRENGTH = 1.0;
const DISTANCE_SCALE = 4;
const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 1200;

export const sagaProjectionCenter = function* () {
  const data = yield* select(mapSelectors.selectSystemData);

  const nodes: GraphNode[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    name: neighbor.name,
    d: neighbor.distance,
    n: neighbor.n,
    x: 0,
    y: 0,
  }));
  nodes.push({
    id: data.id,
    name: data.name,
    d: 0,
    n: 0,
    x: 0,
    y: 0,
  });

  if (!nodes.length) {
    return;
  }

  const centerNode = nodes[nodes.length - 1]!;

  let links: SimulationLink[] = nodes.map((node) => ({
    target: node,
    source: centerNode,
    distance: node.d,
    strength: CENTER_STRENGTH,
  }));

  let prev: GraphNode | undefined;
  for (const node of nodes) {
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
    .forceSimulation(nodes)
    .force("center", d3.forceCenter(0, 0))
    .force(
      "link",
      d3
        .forceLink<GraphNode, SimulationLink>(links)
        .distance((d) => d.distance * DISTANCE_SCALE)
        .id((d) => d.id)
        .strength((d) => d.strength)
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("collide", d3.forceCollide().radius(44).strength(0.1))
    .force("bounds", () => {
      for (const node of nodes) {
        node.x = Math.max(
          (GRAPH_WIDTH / 2) * -1,
          Math.min(GRAPH_WIDTH / 2, node.x!)
        );
        node.y = Math.max(
          (GRAPH_HEIGHT / 2) * -1,
          Math.min(GRAPH_HEIGHT / 2, node.y!)
        );
      }
    })
    .stop();

  const simulationSteps = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
  );
  simulation.tick(simulationSteps);

  yield put(mapActions.setNodes(keyBy(nodes, "id")));
};
