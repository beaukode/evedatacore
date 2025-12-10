import { Alert, SxProps } from "@mui/material";
import { Web3TransactionError, isWeb3TransactionError } from "@/api/mudweb3";
import ExternalLink from "../ui/ExternalLink";
import { shorten } from "@/tools";
import { explorerBaseUrl } from "@/config";

interface Web3ErrorAlertProps {
  error: Error | Web3TransactionError | null | undefined;
  sx?: SxProps;
}

export const Web3ErrorAlert: React.FC<Web3ErrorAlertProps> = ({
  error,
  sx,
}) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={sx}>
      <div>
        {error.message}{" "}
        {isWeb3TransactionError(error) && error.tx && (
          <ExternalLink
            href={`${explorerBaseUrl}/tx/${error.tx}`}
            title="View transaction"
          >
            {shorten(error.tx)}
          </ExternalLink>
        )}
      </div>
      {isWeb3TransactionError(error) && error.details && (
        <pre>{error.details.join("\n")}</pre>
      )}
    </Alert>
  );
};
