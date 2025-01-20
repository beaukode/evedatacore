import React from "react";
import { Avatar, Box, Button } from "@mui/material";
import { NavLink } from "react-router";
import LooksOutlinedButton from "../ui/LooksOutlinedButton";

interface ButtonItemProps {
  name: string;
  typeId: number | string;
  image?: string;
  fastRender?: boolean;
}

const ButtonItem: React.FC<ButtonItemProps> = ({
  name,
  typeId,
  image,
  fastRender,
}) => {
  const button = fastRender ? (
    <LooksOutlinedButton>{name}</LooksOutlinedButton>
  ) : (
    <Button
      component={NavLink}
      to={`/explore/types/${typeId}`}
      variant="outlined"
    >
      {name}
    </Button>
  );
  return (
    <Box display="flex" alignItems="center">
      {image && (
        <Avatar
          alt={name}
          sx={{ bgcolor: "black", color: "silver", mr: 1 }}
          src={image}
          variant="rounded"
        />
      )}
      {button}
    </Box>
  );
};

export default ButtonItem;
