import React from "react";
import { Avatar, Box, Button } from "@mui/material";
import { NavLink } from "react-router";

interface ButtonItemProps {
  name: string;
  typeId: number | string;
  image?: string;
}

const ButtonItem: React.FC<ButtonItemProps> = ({ name, typeId, image }) => {
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
      <Button component={NavLink} to={`/explore/types/${typeId}`}>
        {name}
      </Button>
    </Box>
  );
};

export default ButtonItem;
