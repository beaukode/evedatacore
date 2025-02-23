import React from "react";
import {
  Typography,
  Paper,
  LinearProgress,
  Box,
  IconButton,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

interface RootPaperProps extends React.ComponentProps<typeof Paper> {
  title: string;
  loading?: boolean;
  backButton?: boolean;
  children?: React.ReactNode;
  titleAdornment?: React.ReactNode;
}

const PaperLevel1: React.FC<RootPaperProps> = ({
  title,
  titleAdornment,
  loading,
  backButton,
  children,
  sx,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          component="h2"
          sx={{ bgcolor: "background.default" }}
          gutterBottom
        >
          {backButton && (
            <IconButton color="primary" onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
          )}
          {title}
        </Typography>
        {titleAdornment}
      </Box>
      {loading && (
        <Box sx={{ position: "relative" }}>
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
            }}
          />
        </Box>
      )}
      <Paper
        elevation={1}
        sx={{ p: 2, mb: 2, overflowX: "auto", ...sx }}
        {...rest}
      >
        {children}
      </Paper>
    </>
  );
};

export default PaperLevel1;
