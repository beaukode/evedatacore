import { RTNode } from "@prismicio/client";

export function getTextFromNode(
  node: RTNode | undefined,
  defaultValue: string = ""
): string {
  return node && "text" in node ? node.text : defaultValue;
}

export function parseGridWidth(width: string): number {
  const value = Number(width);
  if (Number.isNaN(value) || value < 1 || value > 12) {
    return 6;
  }
  return value;
}

export const sx = {
  "& p": { marginBlockStart: 1, marginBlockEnd: 1 },
  "& p:first-of-type": { marginBlockStart: 0 },
  "& p:last-of-type": { marginBlockEnd: 0 },
  "& pre": {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    backgroundColor: "background.paper",
    padding: "2px 4px",
  },
};
