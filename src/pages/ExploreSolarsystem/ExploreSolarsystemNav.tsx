import React from "react";
import { Box, Button, Link, Paper, Tab, Tabs } from "@mui/material";
import { NavLink } from "react-router";

interface ExploreSolarsystemNavProps {
  id: string;
  currentTab: number;
}

const ExploreSolarsystemNav: React.FC<ExploreSolarsystemNavProps> = ({
  id,
  currentTab,
}) => {
  return (
    <Box display="flex" gap={2} alignItems="center">
      <Button
        component={Link}
        href={`https://ef-map.com/?system=${id}&zoom=75`}
        title="View on EF Map"
        size="small"
        variant="outlined"
        color="primary"
        rel="noopener"
        target="_blank"
      >
        View on EF Map
      </Button>
      <Paper elevation={1}>
        <Tabs textColor="primary" value={currentTab}>
          <Tab
            label="World data"
            component={NavLink}
            to={`/explore/solarsystems/${id}`}
            replace
          />
          <Tab
            label="2d Map"
            component={NavLink}
            to={`/explore/solarsystems/${id}/map`}
            replace
          />
          <Tab
            label="User data"
            component={NavLink}
            to={`/explore/solarsystems/${id}/data`}
            replace
          />
        </Tabs>
      </Paper>
    </Box>
  );
};

export default ExploreSolarsystemNav;
