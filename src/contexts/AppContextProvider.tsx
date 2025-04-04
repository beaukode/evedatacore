import React from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { createMudSqlClient } from "@shared/mudsql";
import { createMudWeb3Client } from "@shared/mudweb3";
import ConditionalMount from "@/components/ui/ConditionalMount";
import ConnectDialog from "@/components/web3/ConnectDialog";
import { chainId, indexerBaseUrl, worldAddress } from "@/config";
import { AppContext } from "./AppContext";
import useEventsTracking from "./useEventsTracking";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [showConnectDialog, setShowConnectDialog] = React.useState(false);
  const mudSql = React.useMemo(
    () => createMudSqlClient({ indexerBaseUrl, worldAddress }),
    []
  );
  const { pushEvent } = useEventsTracking();

  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  const mudWeb3 = React.useMemo(() => {
    if (!publicClient) {
      throw new Error(`Unable to retrieve Viem client for chain ${chainId}.`);
    }

    return createMudWeb3Client({
      publicClient,
      walletClient,
      mudAddresses: {
        world: worldAddress,
      },
    });
  }, [publicClient, walletClient]);

  return (
    <>
      <ConditionalMount mount={showConnectDialog} keepMounted>
        <ConnectDialog
          open={showConnectDialog}
          onClose={() => setShowConnectDialog(false)}
        />
      </ConditionalMount>
      <AppContext.Provider
        value={{
          mudSql,
          mudWeb3,
          showConnectDialog: () => setShowConnectDialog(true),
          pushTrackingEvent: pushEvent,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};
