import { Button } from "@mui/material";
import ConnectIcon from "@mui/icons-material/Power";
import { useAccount } from "wagmi";
import { useShowConnectDialog } from "@/contexts/AppContext";
import UserButton from "./UserButton";

interface ConnectButtonProps {
  disableMenu?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  disableMenu,
}) => {
  const account = useAccount();
  const showConnectDialog = useShowConnectDialog();

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
      {account.isConnected && account.address && (
        <UserButton address={account.address} disableMenu={disableMenu} />
      )}
    </>
  );
};
