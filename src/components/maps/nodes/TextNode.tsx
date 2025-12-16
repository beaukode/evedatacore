import React from "react";
import { Box } from "@mui/material";
import InternalLink from "@/components/ui/InternalLink";
import { SNMSelectors, useSNMSelector } from "../SystemNeighborsMap/Store";

type TextNodeProps = {
  nodeId: string;
  x: number;
  y: number;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  center?: boolean;
};

const TextNode = React.forwardRef<HTMLDivElement, TextNodeProps>(
  ({ nodeId, x, y, onClick, onMouseOver, onMouseLeave, center }, ref) => {
    const nodeAttributes = useSNMSelector((s) => {
      return SNMSelectors.selectNodeAttributes(s, nodeId);
    });
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
            borderColor: "rgba(0, 255, 43, 0.5)",
            borderWidth: "1px",
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
              to={`/explore/solarsystems/${nodeId}`}
            >
              {nodeAttributes.name}
            </InternalLink>
            <br />
            {nodeAttributes.text}
          </>
        </Box>
      </>
    );
  }
);

TextNode.displayName = "TextNode";

export default TextNode;
