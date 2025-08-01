import React from "react";
import {
  Alert,
  Box,
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAccount, useSwitchChain } from "wagmi";
import { TransactionReceipt } from "viem";
import { isWeb3TransactionError, Web3TransactionError } from "@/api/mudweb3";
import ExternalLink from "../ui/ExternalLink";
import { shorten } from "@/tools";
import { useShowConnectDialog } from "@/contexts/AppContext";
import { chainId } from "@/config";

interface BaseWeb3DialogProps {
  open: boolean;
  owner: string;
  title: React.ReactNode;
  children: React.ReactNode;
  txReceipt?: TransactionReceipt | null;
  txError?: Web3TransactionError | Error | null;
  actions?: React.ReactNode;
  headerActions?: React.ReactNode;
  size?: Breakpoint;
  onClose: () => void;
}

const BaseWeb3Dialog: React.FC<BaseWeb3DialogProps> = ({
  open,
  owner,
  title,
  children,
  txError,
  txReceipt,
  actions,
  headerActions,
  size,
  onClose,
}) => {
  const showConnectDialog = useShowConnectDialog();
  const { switchChain } = useSwitchChain();
  const account = useAccount();

  const disabledOwnerCheck =
    import.meta.env.VITE_WEB3_DISABLE_OWNER_CHECK === "true";

  const state = React.useMemo(() => {
    if (!account.isConnected) return "connect";
    if (account.chainId !== chainId) return "chain";
    if (disabledOwnerCheck) return "ready";
    if (
      !disabledOwnerCheck &&
      !(account.addresses || [])
        .map((a) => a.toLowerCase())
        .includes(owner.toLowerCase())
    )
      return "owner";
    if (account.address?.toLowerCase() !== owner.toLowerCase())
      return "address";
    return "ready";
  }, [
    owner,
    account.isConnected,
    account.chainId,
    account.address,
    account.addresses,
    disabledOwnerCheck,
  ]);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      maxWidth={size || "sm"}
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>{title}</Box>
          {state === "ready" && headerActions && <Box>{headerActions}</Box>}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        {state !== "ready" && (
          <>
            <DialogContentText id="alert-dialog-description" gutterBottom>
              {state === "connect" &&
                "This action require you to connect your wallet."}
              {state === "chain" &&
                "Your wallet is connected to the wrong network, please switch to pyrope."}
              {state === "owner" && "You do not seem to be the owner."}
              {state === "address" &&
                "Your current address do not match the owner, please switch the matching account."}
            </DialogContentText>
            {state === "owner" && (
              <>
                <DialogContentText gutterBottom>
                  You try to interact with something owned by:
                </DialogContentText>
                <ul>
                  <li>{owner}</li>
                </ul>
                <DialogContentText gutterBottom>
                  Your wallet is connected with the following:
                </DialogContentText>
                <ul>
                  {account.addresses?.map((m) => (
                    <li key={m}>{m.toLowerCase()}</li>
                  ))}
                </ul>
                <DialogContentText gutterBottom>
                  Please check your connected accounts in your wallet app.
                </DialogContentText>
              </>
            )}
            {state === "address" && (
              <>
                <DialogContentText gutterBottom>
                  You try to interact with something owned by:
                </DialogContentText>
                <ul>
                  <li>{owner}</li>
                </ul>
                <DialogContentText gutterBottom>
                  Your current wallet address is:
                </DialogContentText>
                <ul>{account.address?.toLowerCase()}</ul>
                <DialogContentText gutterBottom>
                  Please switch account in your wallet app.
                </DialogContentText>
              </>
            )}
          </>
        )}
        {state === "ready" && children}
        {txError && (
          <Alert severity="error">
            <div>
              {txError.message}{" "}
              {isWeb3TransactionError(txError) && txError.tx && (
                <ExternalLink
                  href={`https://explorer.pyropechain.com/tx/${txError.tx}`}
                  title="View transaction"
                >
                  {shorten(txError.tx)}
                </ExternalLink>
              )}
            </div>
            {isWeb3TransactionError(txError) && txError.details && (
              <pre>{txError.details.join("\n")}</pre>
            )}
          </Alert>
        )}
        {txReceipt && (
          <Alert severity="success">
            Successful transaction:{" "}
            <ExternalLink
              href={`https://explorer.pyropechain.com/tx/${txReceipt.transactionHash}`}
              title="View transaction"
            >
              {shorten(txReceipt.transactionHash)}
            </ExternalLink>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {state !== "ready" && <Button onClick={() => onClose()}>Cancel</Button>}
        {state === "connect" && (
          <Button onClick={showConnectDialog} variant="contained">
            Connect
          </Button>
        )}
        {state === "chain" && (
          <Button onClick={() => switchChain({ chainId })} variant="contained">
            Switch
          </Button>
        )}
        {(state === "owner" || state === "address") && (
          <Button variant="contained" disabled>
            Continue
          </Button>
        )}
        {state === "ready" && (
          <>
            <Button onClick={() => onClose()}>Close</Button>
            {actions}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BaseWeb3Dialog;
