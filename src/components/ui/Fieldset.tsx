// Taken from https://muhimasri.com/blogs/react-mui-fieldset/
import React from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";

interface FieldsetProps {
  title?: React.ReactNode;
  color?: string;
  hoverColor?: string;
  titleSize?: string;
  borderWidth?: number;
  borderRadius?: number;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const Fieldset = ({
  title,
  color = "primary.light",
  hoverColor = "primary.light",
  children,
  sx = {},
  ...props
}: FieldsetProps) => {
  return (
    <Box
      component="fieldset"
      sx={{
        borderColor: color,
        borderWidth: 2,
        borderRadius: (theme) => theme.shape.borderRadius / 4,
        my: (theme) => theme.spacing(1),
        "&:hover": {
          borderColor: hoverColor,
          "& legend": {
            color: hoverColor,
          },
        },
        ...sx,
      }}
      {...props}
    >
      {title && (
        <Typography
          component="legend"
          variant="caption"
          sx={{
            color: color,
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default Fieldset;
