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

export type ProjectionKey = "center" | "flat";
export type ToolKey = "select" | "routing";
export type DisplayKey = "distances" | "lpoints" | "planets";

export type NodeAttributes = {
  id: string;
  name: string;
  text?: string;
  sx?: SxProps;
  children?: React.ReactNode;
  opacity?: number;
  highlighted?: boolean;
};

export type NodesAttributesMap = Record<string, NodeAttributes>;
export type PartialNodesAttributesMap = Record<string, Partial<NodeAttributes>>;

export type GraphNode = {
  id: string;
  name: string;
  x?: number;
  y?: number;
  d: number;
  n: number;
};

export type GraphConnnection = {
  source: string;
  target: string;
};

export type PointOfInterestIcon = "shield" | "circle" | "moon";

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
  { name: "Metal-Rich Cluster", color: "gray" },
  { name: "Murky Outer Field", color: "orange" },
  { name: "Rocky Asteroid Field", color: "brown" },
  { name: "Carbon Rock Debris Field", color: "black" },
  { name: "Unremarkable Asteroid", color: "white" },
  { name: "Heavy Metal Harvest Field ", color: "gold" },
  { name: "Rift", color: "red" },
  { name: "Minor Drone Nest", color: "dodgerblue", icon: "shield" },
  { name: "Feral Enclave", color: "orange", icon: "shield" },
  { name: "Domination Cluster", color: "red", icon: "shield" },
  { name: "Ruined Bombardment Cannon", color: "gray", icon: "shield" },
  { name: "Inculcator Wreckage", color: "orange", icon: "shield" },
  { name: "Razed Inculcator", color: "green", icon: "shield" },
  { name: "Ruined Inculcator", color: "brown", icon: "shield" },
  { name: "Inculcator Foundation", color: "black", icon: "shield" },
  { name: "Unmoored Silo", color: "pink", icon: "circle" },
  { name: "Mangled Convoy", color: "orange", icon: "circle" },
  { name: "Derelict Spire", color: "green", icon: "circle" },
  { name: "Ruined Processing Plant", color: "brown", icon: "circle" },
  { name: "Crumbling Mining Platform", color: "black", icon: "circle" },
  { name: "Communication Module Debris", color: "white", icon: "circle" },
  { name: "Feralized Outpost", color: "red", icon: "moon" },
  { name: "Abandoned Nexus Core", color: "dodgerblue", icon: "moon" },
  { name: "Abandoned Processing Plant", color: "brown", icon: "moon" },
  { name: "Destroyed Research Archive", color: "gold", icon: "moon" },
];
