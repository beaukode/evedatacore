import { Button } from "@mui/material";
import ConnectIcon from "@mui/icons-material/Power";
import { useShowConnectDialog, useSmartCharacter } from "@/contexts/AppContext";
import UserButton from "./UserButton";

interface ConnectButtonProps {
  disableMenu?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  disableMenu,
}) => {
  const smartCharacter = useSmartCharacter();
  const showConnectDialog = useShowConnectDialog();

  return (
    <>
      {!smartCharacter.isConnected && !smartCharacter.isConnecting && (
        <Button
          onClick={showConnectDialog}
          variant="contained"
          startIcon={<ConnectIcon />}
          sx={{ minWidth: 150 }}
        >
          Connect
        </Button>
      )}
      {smartCharacter.isConnected && <UserButton disableMenu={disableMenu} />}
    </>
  );
};
