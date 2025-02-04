import { Button } from "@mui/material";
import ConnectIcon from "@mui/icons-material/Power";
import { useAccount, useDisconnect } from "wagmi";
import { shorten } from "@/tools";
import { useShowConnectDialog } from "@/contexts/AppContext";

export const ConnectButton = () => {
  const account = useAccount();
  const showConnectDialog = useShowConnectDialog();

  const { disconnect } = useDisconnect();

  return (
    <>
      {!account.isConnected && (
        <Button
          onClick={showConnectDialog}
          variant="contained"
          startIcon={<ConnectIcon />}
          sx={{ minWidth: 150 }}
        >
          Connect
        </Button>
      )}
      {account.isConnected && (
        <Button
          onClick={() => {
            console.log("disconnecting");
            disconnect();
          }}
          variant="outlined"
          startIcon={<ConnectIcon />}
          sx={{ minWidth: 150 }}
        >
          {shorten(account.address, 8)}
        </Button>
      )}
    </>
  );
};
