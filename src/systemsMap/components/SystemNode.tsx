import React from "react";
import { Box } from "@mui/material";
import InternalLink from "@/components/ui/InternalLink";
import { SNMSelectors, useSNMSelector } from "../Store";
import SystemContentIcons from "./SystemContentIcons";

type SystemNodeProps = {
  nodeId: string;
  x: number;
  y: number;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  center?: boolean;
};

const SystemNode = React.forwardRef<HTMLDivElement, SystemNodeProps>(
  ({ nodeId, x, y, onClick, onMouseOver, onMouseLeave, center }, ref) => {
    const nodeAttributes = useSNMSelector((s) => {
      return SNMSelectors.selectNodeAttributes(s, nodeId);
    });
    const dbRecord = useSNMSelector((s) =>
      SNMSelectors.selectDbRecord(s, nodeId)
    );
    if (!nodeAttributes) {
      return null;
    }

    return (
      <>
        <Box
          ref={ref}
          sx={{
            position: "absolute",
            left: x - 40,
            top: y - 21,
            borderColor:
              dbRecord?.color === "default"
                ? "primary.dark"
                : dbRecord?.color ?? "primary.dark",
            borderWidth: "2px",
            borderStyle: "solid",
            fontSize: "12px",
            width: "80px",
            height: "42px",
            textAlign: "center",
            color: center ? "text.default" : "white",
            padding: "2px 4px",
            borderRadius: "10px",
            backgroundColor: center ? "background.default" : "background.paper",
            cursor: "default",
            ...nodeAttributes.sx,
          }}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
        >
          <>
            <InternalLink
              title={`View system ${nodeAttributes.name}`}
              to={`/explore/solarsystems/${nodeId}/map`}
            >
              {nodeAttributes.name}
            </InternalLink>
            <br />
            {nodeAttributes.text}
          </>
          <SystemContentIcons
            value={dbRecord?.content ?? []}
            maxIcons={6}
            sx={{
              position: "absolute",
              bottom: -20,
              left: -4,
              zIndex: 1000,
            }}
          />
        </Box>
      </>
    );
  }
);

SystemNode.displayName = "TextNode";

export default SystemNode;
