import React from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "./AppContext";
import { createMudSqlClient } from "@/api/mudsql";
import { chainId, indexerBaseUrl, worldAddress } from "@/constants";
import { createMudWeb3Client } from "@/api/mudweb3";
import ConditionalMount from "@/components/ui/ConditionalMount";
import ConnectDialog from "@/components/web3/ConnectDialog";

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

  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  const mudWeb3 = React.useMemo(() => {
    if (!publicClient) {
      throw new Error(`Unable to retrieve Viem client for chain ${chainId}.`);
    }
    return createMudWeb3Client({
      worldAddress,
      publicClient,
      walletClient,
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
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};
