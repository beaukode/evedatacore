import React from "react";
import { useClient } from "wagmi";
import { AppContext } from "./AppContext";
import { createMudSqlClient } from "@/api/mudsql";
import { chainId, indexerBaseUrl, worldAddress } from "@/constants";
import { createMudWeb3Client } from "@/api/mudweb3";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const mudSql = React.useMemo(
    () => createMudSqlClient({ indexerBaseUrl, worldAddress }),
    []
  );

  const ethClient = useClient({ chainId });

  const mudWeb3 = React.useMemo(() => {
    if (!ethClient) {
      throw new Error(`Unable to retrieve Viem client for chain ${chainId}.`);
    }
    return createMudWeb3Client({ worldAddress, ethClient });
  }, [ethClient]);

  return (
    <AppContext.Provider value={{ mudSql, mudWeb3 }}>
      {children}
    </AppContext.Provider>
  );
};
