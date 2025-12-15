import React from "react";
import { genericNodeContent } from "./utils";
import { NodeAttributes, GraphNode, NodesAttributesMap } from "../common";

type GetDistance = (aId: string, bId: string) => number;

export function useDisplayDistances(
  centerNodeId: string,
  initialNodes: NodesAttributesMap,
  getDistance: GetDistance
) {
  const onNodeOver = React.useCallback(
    (target: GraphNode | null): NodesAttributesMap => {
      if (target && target.id !== centerNodeId) {
        const nodes: Record<string, NodeAttributes> = Object.values(
          initialNodes
        ).reduce(
          (acc, node) => {
            const distance = getDistance(node.id, target.id);
            acc[node.id] = {
              ...node,
              children: genericNodeContent(
                node.id,
                node.name,
                distance ? distance.toFixed(2) : ""
              ),
            };
            return acc;
          },
          {} as Record<string, NodeAttributes>
        );
        return nodes;
      }
      // Reset to initial nodes when no target is provided or the target is the center node
      return initialNodes;
    },
    [initialNodes, centerNodeId, getDistance]
  );

  return {
    onNodeOver,
  };
}
