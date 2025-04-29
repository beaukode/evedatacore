import React from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { createMudSqlClient } from "@shared/mudsql";
import { createMudWeb3Client } from "@shared/mudweb3";
import { AppContext, SmartCharacter } from "./AppContext";
import ConditionalMount from "@/components/ui/ConditionalMount";
import ConnectDialog from "@/components/web3/ConnectDialog";
import { chainId, indexerBaseUrl, worldAddress } from "@/config";
import useEventsTracking from "./useEventsTracking";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [showConnectDialog, setShowConnectDialog] = React.useState(false);
  const [smartCharacter, setSmartCharacter] = React.useState<SmartCharacter>({
    isConnected: false,
    isConnecting: true,
  });
  const mudSql = React.useMemo(
    () =>
      createMudSqlClient({
        indexerBaseUrl,
        worldAddress,
        debugSql: import.meta.env.VITE_DEBUG_SQL === "true",
      }),
    []
  );
  const { pushEvent } = useEventsTracking();

  const account = useAccount();
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

  React.useEffect(() => {
    const address = account.address;
    if (account.isConnected && address) {
      mudWeb3.characterGetId({ ownerAddress: address }).then((id) => {
        if (id) {
          return mudWeb3
            .assemblyGetMetadata({ assemblyId: id })
            .then((metadata) => {
              setSmartCharacter({
                isConnected: true,
                isConnecting: false,
                address,
                characterId: id,
                characterName: metadata.name,
              });
            });
        } else {
          setSmartCharacter({
            isConnected: true,
            isConnecting: false,
            address,
          });
        }
      });
    } else {
      setSmartCharacter({
        isConnected: false,
        isConnecting: account.isConnecting,
      });
    }
  }, [account.isConnected, account.address, mudWeb3, account.isConnecting]);

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
          smartCharacter,
          showConnectDialog: () => setShowConnectDialog(true),
          pushTrackingEvent: pushEvent,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};
