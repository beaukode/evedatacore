// Taken from https://muhimasri.com/blogs/react-mui-fieldset/
import React from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";

interface FieldsetProps {
  title?: React.ReactNode;
  color?: string;
  titleSize?: string;
  borderWidth?: number;
  borderRadius?: number;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const Fieldset = ({
  title,
  color = "primary.light",
  children,
  sx = {},
  ...props
}: FieldsetProps) => {
  return (
    <Box
      component="fieldset"
      sx={{
        borderColor: color,
        borderWidth: 1,
        borderRadius: (theme) => theme.shape.borderRadius / 2,
        my: (theme) => theme.spacing(1),
        ...sx,
      }}
      {...props}
    >
      {title && (
        <Typography
          component="legend"
          sx={{
            color: color,
            fontSize: (theme) => theme.typography.body1,
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
