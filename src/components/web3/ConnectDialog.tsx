import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Alert,
  LinearProgress,
  DialogContent,
} from "@mui/material";
import { Connector, useConnect } from "wagmi";
import { keyBy } from "lodash-es";
import ExternalLink from "../ui/ExternalLink";

interface ConnectDialogProps {
  open: boolean;
  onClose: () => void;
}

function dedupeWeb3Connectors(
  connectors: Array<{ connector: Connector; provider: unknown }>
) {
  const connectorsMap = keyBy(connectors, (c) => c.connector.id);
  const deduped = Object.entries(connectorsMap).reduce(
    (acc, [key, { connector, provider }]) => {
      if (!provider || typeof provider !== "object") return acc;
      // Dedupe Eve vault from the injected connector
      if (key === "injected" && "isOneKey" in provider && provider.isOneKey) {
        return acc;
      }
      // Dedupe metamask from the eve vault connector
      if (key === "eveVault" && !("isOneKey" in provider)) {
        return acc;
      }
      // Dedupe metamask from the injected connector
      if (
        key === "injected" &&
        "_metamask" in provider &&
        provider._metamask &&
        connectorsMap["metaMaskSDK"] &&
        typeof connectorsMap["metaMaskSDK"].provider === "object" &&
        connectorsMap["metaMaskSDK"].provider &&
        "_metamask" in connectorsMap["metaMaskSDK"].provider &&
        connectorsMap["metaMaskSDK"]?.provider?._metamask
      ) {
        return acc;
      }
      return [...acc, connector];
    },
    [] as Connector[]
  );
  return deduped;
}

const ConnectDialog: React.FC<ConnectDialogProps> = ({ open, onClose }) => {
  const [readyConnectors, setReadyConnectors] =
    React.useState<Array<Connector>>();
  const { connectAsync, connectors } = useConnect();

  const eveVault = !!readyConnectors?.find((c) => c.id === "eveVault");

  React.useEffect(() => {
    if (!open) return;
    console.log("connectors");
    Promise.all(
      connectors.map((connector) =>
        connector.getProvider().then((provider) => ({ connector, provider }))
      )
    ).then((c) => {
      setReadyConnectors(dedupeWeb3Connectors(c));
    });
  }, [open, connectors]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Connect your wallet</DialogTitle>
      <DialogContent>
        {readyConnectors && (
          <>
            {!eveVault && (
              <Alert severity="info">
                <strong>Eve vault wallet is not detected</strong>
                <br />
                If it's your first experience with wallets, I suggest to use it
                as it's the official one for EVE Frontier.{" "}
                <ExternalLink
                  title="Install EVE Vault"
                  href="https://docs.evefrontier.com/EveVault/installation"
                />
              </Alert>
            )}
            {readyConnectors.map((connector) => {
              return (
                <Button
                  key={connector.id}
                  onClick={() =>
                    connector
                      .disconnect()
                      .then(() =>
                        connectAsync({ connector }).then(() => onClose())
                      )
                  }
                  variant="contained"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  {connector.id === "injected"
                    ? "Other wallet"
                    : connector.name}
                </Button>
              );
            })}
          </>
        )}
        {!readyConnectors && <LinearProgress />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectDialog;
