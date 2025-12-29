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

export type ToolKey = "select" | "routing";
export type DisplayKey = "distances" | "lpoints" | "planets";

export type NodeAttributes = {
  id: string;
  name: string;
  text?: string;
  sx?: SxProps;
  children?: React.ReactNode;
};

export type NodesAttributesMap = Record<string, NodeAttributes>;
export type PartialNodesAttributesMap = Record<string, Partial<NodeAttributes>>;

export type GraphNode = {
  id: string;
  d: number;
  n: number;
};

export type GraphConnnection = {
  source: string;
  target: string;
};

export type PointOfInterestIcon = "shield" | "circle";

export type PointOfInterest = {
  name: string;
  color: string;
  icon?: PointOfInterestIcon;
};

export const pointOfInterests: Array<PointOfInterest> = [
  { name: "Crystalline Shear Field", color: "cyan" },
  { name: "Platinum Mass Cluster", color: "silver" },
  { name: "Hydrosulphide Formation", color: "dodgerblue" },
  { name: "Natural Asteroid Cluster", color: "green" },
  { name: "Metal Rich", color: "gray" },
  { name: "Rocky Asteroid", color: "brown" },
  { name: "Rift", color: "gold" },
  { name: "Minor Drone Nest", color: "dodgerblue", icon: "shield" },
  { name: "Feral Enclave", color: "orange", icon: "shield" },
  { name: "Domination Cluster", color: "red", icon: "shield" },
  { name: "Unmoored Silo", color: "pink", icon: "circle" },
  { name: "Ruined Inculator", color: "coral", icon: "circle" },
];
