import { Button } from "@mui/material";
import ConnectIcon from "@mui/icons-material/Power";
import { ConnectButton as RkConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectButton = () => {
  return (
    <RkConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return (
            <Button
              onClick={openConnectModal}
              variant="contained"
              startIcon={<ConnectIcon />}
              disabled={!ready}
              sx={{ minWidth: 150 }}
            >
              Connect
            </Button>
          );
        }
        if (chain.unsupported) {
          return (
            <Button
              onClick={openChainModal}
              variant="contained"
              startIcon={<ConnectIcon />}
              disabled={!ready}
              sx={{ minWidth: 150 }}
            >
              Wrong network
            </Button>
          );
        }
        return (
          <Button
            onClick={openAccountModal}
            variant="outlined"
            startIcon={<ConnectIcon />}
            disabled={!ready}
            sx={{ minWidth: 150 }}
          >
            {account.displayName}
          </Button>
        );
      }}
    </RkConnectButton.Custom>
  );
};
