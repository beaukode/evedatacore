import { Box, SxProps } from "@mui/material";
import React from "react";

type TextNodeProps = {
  x: number;
  y: number;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
  sx?: SxProps;
  children: React.ReactNode;
  center?: boolean;
};

const TextNode = React.forwardRef<HTMLDivElement, TextNodeProps>(
  ({ x, y, onClick, onMouseOver, onMouseLeave, children, center, sx }, ref) => {
    return (
      <>
        <Box
          ref={ref}
          sx={{
            position: "absolute",
            left: x - 40,
            top: y - 21,
            border: "1px solid #00ff2b",
            fontSize: "12px",
            width: "80px",
            height: "42px",
            textAlign: "center",
            color: center ? "text.default" : "white",
            padding: "2px 4px",
            borderRadius: "10px",
            backgroundColor: center ? "background.default" : "background.paper",
            cursor: "default",
            ...sx,
          }}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </Box>
      </>
    );
  }
);

TextNode.displayName = "TextNode";

export default TextNode;
