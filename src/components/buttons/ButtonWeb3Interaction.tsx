import React from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Settings";

interface ButtonWeb3InteractionProps {
  onClick: () => void;
  title?: string;
}

const ButtonWeb3Interaction: React.FC<ButtonWeb3InteractionProps> = ({
  onClick,
  title,
}) => {
  return (
    <Button
      color="warning"
      variant="contained"
      size="small"
      title={title}
      onClick={onClick}
      sx={{ minWidth: 0, py: 0.25, px: 0.5, mx: 1 }}
    >
      <EditIcon fontSize="small" style={{ marginRight: 0 }} />
    </Button>
  );
};

export default ButtonWeb3Interaction;
