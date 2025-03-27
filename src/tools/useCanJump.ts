import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useMudWeb3 } from "@/contexts/AppContext";
import { isWeb3TransactionError } from "@shared/mudweb3";

export type CanJumpResult = {
  canJump?: boolean;
  message?: string;
};

function useCanJump(
  sourceGateId: string,
  sourceGateState: number,
  destinationGateId: string,
  destinationGateState: number
) {
  const mudWeb3 = useMudWeb3();

  const accountAddress = mudWeb3.writeClient?.account;

  const queryCanJump = useQuery({
    queryKey: [
      "SmartGateCanJump",
      sourceGateId,
      destinationGateId,
      accountAddress,
    ],
    queryFn: async () => {
      if (!accountAddress || !destinationGateId) return false;
      return mudWeb3.gateCanJump({
        sourceGateId,
        destinationGateId,
      });
    },
    enabled: Boolean(
      accountAddress &&
        destinationGateId &&
        sourceGateState === 3 &&
        destinationGateState === 3
    ),
    retry: false,
  });

  const r = React.useMemo(() => {
    if (!accountAddress) return { message: "Connect your wallet" };
    if (sourceGateState !== 3 || destinationGateState !== 3)
      return {
        canJump: false,
        message: "Source and destination gates must be online",
      };
    if (queryCanJump.error) {
      if (isWeb3TransactionError(queryCanJump.error)) {
        return {
          canJump: false,
          message:
            queryCanJump.error.details?.[0] || queryCanJump.error.message,
        };
      } else {
        return { canJump: false, message: queryCanJump.error.message };
      }
    }

    if (queryCanJump.data === undefined) return;
    return queryCanJump.data
      ? { canJump: true }
      : { canJump: false, message: "Denied by the SmartGate system" };
  }, [
    accountAddress,
    destinationGateState,
    sourceGateState,
    queryCanJump.error,
    queryCanJump.data,
  ]);

  return r;
}

export default useCanJump;
