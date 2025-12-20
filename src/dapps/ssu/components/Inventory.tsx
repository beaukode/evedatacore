import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { NavLink, useLocation } from "react-router";
import { Assembly } from "@/api/evedatacore-v2";

interface InventoryProps {
  ssu: Assembly;
}

const Inventory: React.FC<InventoryProps> = ({ ssu }) => {
  const location = useLocation();

  const currentTab = location.pathname.endsWith("/take") ? 1 : 0;

  return (
    <>
      <Tabs value={currentTab} variant="fullWidth" scrollButtons>
        <Tab label="Give" component={NavLink} to={`/dapps/ssu/${ssu.id}`} />
        <Tab
          label="Take"
          component={NavLink}
          to={`/dapps/ssu/${ssu.id}/take`}
        />
      </Tabs>
      <Box p={2}>{ssu.ownerName}</Box>
    </>
  );
};

export default Inventory;
