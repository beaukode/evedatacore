import { put, select } from "typed-redux-saga";
import * as d3 from "d3-force";
import * as d3Scale from "d3-scale";
import { keyBy } from "lodash";
import { mapActions, mapSelectors } from "..";
import { GraphNode } from "../../common";

const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 1200;

export const sagaProjectionFlat = function* () {
  const data = yield* select(mapSelectors.selectSystemData);

  const center = {
    x: Number(data.location[0]),
    y: Number(data.location[2]) * -1,
  };

  const nodes: GraphNode[] = data.neighbors.map((neighbor) => ({
    id: neighbor.id,
    name: neighbor.name,
    d: neighbor.distance,
    n: neighbor.n,
    x: Number(neighbor.location[0]) - center.x,
    y: Number(neighbor.location[2]) * -1 - center.y,
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

  const minX = Math.min(...nodes.map((node) => node.x!));
  const maxX = Math.max(...nodes.map((node) => node.x!));
  const x = d3Scale.scaleLinear([minX, maxX], [-550, 550]);

  const minY = Math.min(...nodes.map((node) => node.y!));
  const maxY = Math.max(...nodes.map((node) => node.y!));
  const y = d3Scale.scaleLinear([minY, maxY], [-550, 550]);

  for (const node of nodes) {
    node.x = x(node.x!);
    node.y = y(node.y!);
  }

  const simulation = d3
    .forceSimulation(nodes)
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
