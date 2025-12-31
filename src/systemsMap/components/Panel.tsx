import React from "react";
import { Box, Paper, SxProps, Typography, useTheme } from "@mui/material";

interface PanelHeaderProps {
  title: string;
  titleAdornment?: React.ReactNode;
  sx?: SxProps;
  containerSx?: SxProps;
  children?: React.ReactNode;
}

const Panel: React.FC<PanelHeaderProps> = ({
  title,
  titleAdornment,
  sx,
  containerSx,
  children,
}) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        mb: theme.spacing(1),
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          borderBottom: `2px dashed ${theme.palette.divider}`,
        }}
      >
        <Typography component="h3">{title}</Typography>
        {titleAdornment}
      </Box>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        flexGrow={1}
        flexShrink={1}
        sx={containerSx}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default Panel;
