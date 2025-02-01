import React from "react";
import { ListItem, ListItemText } from "@mui/material";

interface ListItemProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  disableGutters?: boolean;
}

const BasicListItem: React.FC<ListItemProps> = ({
  title,
  disableGutters,
  children,
}) => (
  <ListItem sx={disableGutters ? { py: 0 } : {}} disableGutters>
    <ListItemText>
      {title}: {children}
    </ListItemText>
  </ListItem>
);

export default BasicListItem;
