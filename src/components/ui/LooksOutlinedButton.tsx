import React from "react";
import { alpha, Box, useTheme } from "@mui/material";

interface LooksOutlinedButtonProps extends React.ComponentProps<typeof Box> {
  children?: React.ReactNode;
}

const LooksOutlinedButton: React.FC<LooksOutlinedButtonProps> = ({
  children,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: "5px 15px",
        minWidth: 64,
        display: "inline-flex",
        border: "1px solid currentColor",
        borderColor: alpha(theme.palette.primary.main, 0.5),
        borderRadius: 1,
        lineHeight: 1.75,
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default LooksOutlinedButton;
