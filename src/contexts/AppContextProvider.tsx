import React from "react";
import { AppContext } from "./AppContext";
import { createClient } from "@/api/mudsql";
import { indexerBaseUrl, worldAddress } from "@/constants";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const mudSql = React.useMemo(
    () => createClient({ indexerBaseUrl, worldAddress }),
    []
  );

  return (
    <AppContext.Provider value={{ mudSql }}>{children}</AppContext.Provider>
  );
};
