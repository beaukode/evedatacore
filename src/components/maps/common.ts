import { SxProps } from "@mui/material";

export type System = {
  id: string;
  name: string;
  location: [string, string, string];
  gates?: string[];
};

export type SystemMap = System & {
  d_matrix: Record<string, number>;
  neighbors: Array<
    System & {
      distance: number;
      n: number;
    }
  >;
};

export type ToolKey = "select" | "routing" | "wip";
export type DisplayKey = "distances" | "lpoints" | "planets";

export type NodeAttributes = {
  id: string;
  name: string;
  text?: string;
  sx?: SxProps;
  children?: React.ReactNode;
};

export type NodesAttributesMap = Record<string, NodeAttributes>;

export type GraphNode = {
  id: string;
  d: number;
  n: number;
};

export type GraphConnnection = {
  source: string;
  target: string;
};
