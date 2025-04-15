import React from "react";
import { Typography, Button, Box } from "@mui/material";
import ConnectIcon from "@mui/icons-material/Power";
import PaperLevel1 from "@/components/ui/PaperLevel1";
import { useShowConnectDialog } from "@/contexts/AppContext";

const Connect: React.FC = () => {
  const showConnectDialog = useShowConnectDialog();

  return (
    <>
      <PaperLevel1 title="Browser connection required">
        <Typography variant="body1">
          To use this DApp from your browser, you need to connect your wallet.
        </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <Button
            onClick={showConnectDialog}
            variant="contained"
            size="large"
            startIcon={<ConnectIcon />}
          >
            Connect
          </Button>
        </Box>
      </PaperLevel1>
      <PaperLevel1 title="Configure your in-game assembly">
        <Typography variant="body1">
          An alternative is to configure an in-game assembly to access the DApp.
          <br />
          <br />
          Then, you will be automatically connected with your character's
          wallet.
          <br />
          <br />
          Additionally, it will give other players the opportunity to use the
          DApp by interacting with your assembly.
        </Typography>
        <ol>
          <li>Navigate near an assembly that you own.</li>
          <li>Right click the assembly and select "Interact".</li>
          <li>Click the orange "Edit unit" button.</li>
          <li>Fill the DAPP URL field with: {window.location.href}</li>
          <li>Click the "Save" button.</li>
          <li>Click the "Dapp Link" button.</li>
        </ol>
      </PaperLevel1>
    </>
  );
};

export default Connect;
