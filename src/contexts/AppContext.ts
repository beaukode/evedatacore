import React from "react";
import { FixedGetSolarsystemsResponse } from "@/api/stillness";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";
import { MudSqlClient } from "@/api/mudsql";

interface AppContextProps {
  solarSystems: SolarSystemsIndex;
  setSolarSystems: (data: FixedGetSolarsystemsResponse) => void;
  mudSql: MudSqlClient;
}

export const AppContext = React.createContext<AppContextProps | undefined>(
  undefined
);

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}

export function useSolarSystemsIndex() {
  const { solarSystems } = useAppContext();
  return solarSystems;
}

export function useMudSql() {
  const { mudSql } = useAppContext();
  return mudSql;
}
