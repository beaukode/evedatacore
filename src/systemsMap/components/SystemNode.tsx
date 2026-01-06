import React from "react";
import { Box, Paper } from "@mui/material";
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
      <Paper
        ref={ref}
        sx={{
          position: "absolute",
          left: x - 40,
          top: y - 21,
          width: "80px",
          height: "42px",
          borderRadius: "10px",
        }}
        onMouseDown={(e) => e.stopPropagation()} // prevent dragging the map
      >
        <Box
          ref={ref}
          sx={{
            width: "100%",
            height: "100%",
            borderColor:
              dbRecord?.color === "default"
                ? "primary.dark"
                : dbRecord?.color ?? "primary.dark",
            borderWidth: "2px",
            borderStyle: "solid",
            fontSize: "12px",
            textAlign: "center",
            color: center ? "text.default" : "white",
            padding: "2px 4px",
            borderRadius: "10px",
            backgroundColor: center ? "background.default" : "background.paper",
            cursor: "default",
            opacity: nodeAttributes.opacity,
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
              sx={
                nodeAttributes.highlighted
                  ? {
                      backgroundColor: "primary.dark",
                      color: "white",
                      padding: "2px 4px",
                    }
                  : undefined
              }
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
              bottom: -16,
              left: -4,
              zIndex: 1000,
            }}
          />
        </Box>
      </Paper>
    );
  }
);

SystemNode.displayName = "TextNode";

export default SystemNode;
