import React from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { ConnectButton } from "@/components/web3/ConnectButton";
import { NavLink, useLocation } from "react-router";

interface DappHeaderProps {
  title: string;
  tabs?: Record<string, string>;
}

const DappHeader: React.FC<DappHeaderProps> = ({ title, tabs }) => {
  const { pathname } = useLocation();

  const renderTabs = React.useMemo(() => {
    if (!tabs) return null;
    const path = pathname.split("/").slice(0, 4).join("/");
    const routes = Object.keys(tabs);
    const currentTab = routes.findIndex((route) => path === route);

    return (
      <Tabs
        value={currentTab}
        textColor="primary"
        sx={{ backgroundColor: "background.paper" }}
      >
        {Object.entries(tabs).map(([key, value]) => (
          <Tab key={key} label={value} component={NavLink} to={key} />
        ))}
      </Tabs>
    );
  }, [tabs, pathname]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="fixed">
        <Toolbar
          variant="dense"
          sx={{
            pt: { xs: 1, md: 0 },
            px: 1,
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontFamily: "Major Mono Display",
                lineHeight: 1,
              }}
            >
              {title.substring(0, 1)}
              <Box component="span" sx={{ fontSize: "0.8em" }}>
                {title.substring(1)}
              </Box>
            </Typography>
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            {renderTabs}
          </Box>
          <Box minWidth={140}>
            <ConnectButton disableMenu={true} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            {renderTabs}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DappHeader;
