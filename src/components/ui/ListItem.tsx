import React from "react";
import { ListItem as MuiListItem, ListItemText } from "@mui/material";

interface ListItemProps {
  title: string;
  children: React.ReactNode;
  disableGutters?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  disableGutters,
  children,
}) => (
  <MuiListItem sx={disableGutters ? { py: 0 } : {}}>
    <ListItemText>
      <strong>{title}</strong>: {children}
    </ListItemText>
  </MuiListItem>
);

export default ListItem;
