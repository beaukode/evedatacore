import React from "react";
import { Avatar, Box, Button } from "@mui/material";
import { NoMaxWidthTooltip } from "./ui/NoMaxWidthTooltip";
import { NavLink } from "react-router";

interface DisplayItemProps {
  item: {
    name: string;
    typeId: number | string;
    itemId?: string;
    image?: string;
  };
}

const DisplayItem: React.FC<DisplayItemProps> = ({
  item: { itemId, name, typeId, image },
}) => {
  const title = (
    <>
      <div>Type Id: {typeId}</div>
      {itemId && <div>Item Id: {itemId}</div>}
    </>
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
      <NoMaxWidthTooltip disableFocusListener title={title} placement="right">
        <Button component={NavLink} to={`/explore/types/${typeId}`}>
          {name}
        </Button>
      </NoMaxWidthTooltip>
    </Box>
  );
};

export default DisplayItem;
