import React from "react";
import { keyBy } from "lodash-es";
import { SystemMap, NodeAttributes, GraphNode } from "../common";
import { genericNodeContent } from "./utils";
import { useDisplayDistances } from "./useDisplayDistances";

export type ToolKey = "select" | "routing" | "wip";
export type DisplayKey = "distances" | "lpoints" | "planets";

export function useToolbox(map: SystemMap) {
  const [display, setDisplay] = React.useState<DisplayKey>("distances");
  const [tool, setTool] = React.useState<ToolKey>("select");
  const [initialNodes, setInitialNodes] = React.useState<
    Record<string, NodeAttributes>
  >({});
  const [nodes, setNodes] = React.useState<Record<string, NodeAttributes>>({});

  React.useEffect(() => {
    const nodes: NodeAttributes[] = map.neighbors.map((neighbor) => ({
      id: neighbor.id,
      name: neighbor.name,
      children: genericNodeContent(
        neighbor.id,
        neighbor.name,
        neighbor.distance.toFixed(2)
      ),
    }));
    nodes.push({
      id: map.id,
      name: map.name,
      children: <>{map.name}</>,
    });
    const nodesMap = keyBy(nodes, "id");
    setNodes(nodesMap);
    setInitialNodes(nodesMap);
  }, [map]);

  const getDistance = React.useCallback(
    (aId: string, bId: string) => {
      return (
        map.d_matrix[`${aId}-${bId}`] ?? map.d_matrix[`${bId}-${aId}`] ?? 0
      );
    },
    [map]
  );

  const displayDistances = useDisplayDistances(
    map.id,
    initialNodes,
    getDistance
  );

  const displays: Record<
    DisplayKey,
    ReturnType<typeof useDisplayDistances>
  > = React.useMemo(
    () => ({
      distances: displayDistances,
      lpoints: displayDistances,
      planets: displayDistances,
    }),
    [displayDistances]
  );

  const onNodeOver = React.useCallback(
    (target: GraphNode | null) => {
      const newNodes = displays[display].onNodeOver(target);
      setNodes(newNodes);
    },
    [display, displays]
  );

  return {
    display,
    setDisplay,
    tool,
    setTool,
    nodes,
    onNodeOver,
  };
}
