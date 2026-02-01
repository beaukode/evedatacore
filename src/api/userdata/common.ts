export type StrategyOperationChange = "c" | "u" | "d" | "e";

export interface StrategyResult {
  details: Map<string, StrategyOperationChange>;
  created: number;
  updated: number;
  deleted: number;
  exported: number;
}
