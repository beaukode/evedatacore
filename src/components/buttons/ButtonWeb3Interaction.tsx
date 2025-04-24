import React from "react";
import { Button } from "@mui/material";
import InteractIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const iconMap = {
  interact: InteractIcon,
  edit: EditIcon,
  add: AddIcon,
  delete: DeleteIcon,
};
interface ButtonWeb3InteractionProps {
  onClick: () => void;
  icon?: keyof typeof iconMap;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
}

const ButtonWeb3Interaction: React.FC<ButtonWeb3InteractionProps> = ({
  onClick,
  title,
  icon,
  loading,
  disabled,
}) => {
  const Icon = iconMap[icon ?? "interact"];
  return (
    <Button
      color="warning"
      variant="contained"
      size="small"
      loading={loading}
      disabled={disabled}
      title={title}
      onClick={onClick}
      sx={{ minWidth: 0, py: 0.25, px: 0.5, mx: 1 }}
    >
      <Icon fontSize="small" style={{ marginRight: 0 }} />
    </Button>
  );
};

export default ButtonWeb3Interaction;
