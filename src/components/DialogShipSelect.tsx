import React from "react";
import {
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import { Ship, ships, ShipType } from "@/constants";
import { isShipType } from "@/tools/typeGuards";

interface DialogShipSelectProps {
  open: boolean;
  onSelect: (shipType?: ShipType, shipData?: Ship) => void;
}

const DialogShipSelect: React.FC<DialogShipSelectProps> = ({
  open,
  onSelect,
}) => {
  const handleClose = () => {
    onSelect();
  };

  const handleListItemClick = (value: string, data: Ship) => {
    if (isShipType(value)) {
      onSelect(value, data);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <List sx={{ pt: 0 }}>
        {Object.entries(ships).map(([k, v]) => (
          <ListItem disablePadding key={k}>
            <ListItemButton onClick={() => handleListItemClick(k, v)}>
              <ListItemAvatar>
                <Avatar alt={k} src={v.image} variant="rounded">
                  {k[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={k} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleClose} color="secondary">
        Cancel
      </Button>
    </Dialog>
  );
};

export default DialogShipSelect;
