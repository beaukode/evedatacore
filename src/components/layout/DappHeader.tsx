import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { ConnectButton } from "@/components/web3/ConnectButton";

const titleMap: Record<string, string> = {
  corporations: "Corporations",
};

const DappHeader: React.FC = () => {
  const path = location.pathname.split("/");
  const title = (path[2] ? titleMap[path[2]] : "DApps") || "DApps";

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense" sx={{ px: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
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
          <Box>
            <ConnectButton disableMenu={true} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DappHeader;
