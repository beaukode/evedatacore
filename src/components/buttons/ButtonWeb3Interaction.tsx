import React from "react";
import { Button } from "@mui/material";
import InteractIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";

const iconMap = {
  interact: InteractIcon,
  edit: EditIcon,
};
interface ButtonWeb3InteractionProps {
  onClick: () => void;
  icon?: keyof typeof iconMap;
  title?: string;
}

const ButtonWeb3Interaction: React.FC<ButtonWeb3InteractionProps> = ({
  onClick,
  title,
  icon,
}) => {
  const Icon = iconMap[icon ?? "interact"];
  return (
    <Button
      color="warning"
      variant="contained"
      size="small"
      title={title}
      onClick={onClick}
      sx={{ minWidth: 0, py: 0.25, px: 0.5, mx: 1 }}
    >
      <Icon fontSize="small" style={{ marginRight: 0 }} />
    </Button>
  );
};

export default ButtonWeb3Interaction;
