import { Alert, SxProps } from "@mui/material";
import { TransactionReceipt } from "viem";
import ExternalLink from "../ui/ExternalLink";
import { shorten } from "@/tools";
import { explorerBaseUrl } from "@/config";

interface Web3SuccessAlertProps {
  receipt: TransactionReceipt | null | undefined;
  sx?: SxProps;
}

export const Web3SuccessAlert: React.FC<Web3SuccessAlertProps> = ({
  receipt,
  sx,
}) => {
  if (!receipt) return null;

  return (
    <Alert severity="success" sx={sx}>
      Successful transaction:{" "}
      <ExternalLink
        href={`${explorerBaseUrl}/tx/${receipt.transactionHash}`}
        title="View transaction"
      >
        {shorten(receipt.transactionHash)}
      </ExternalLink>
    </Alert>
  );
};
