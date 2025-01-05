import React from "react";
import { FixedGetSolarsystemsResponse } from "@/api/stillness";
import { SolarSystemsIndex } from "@/tools/solarSystemsIndex";

interface AppContextProps {
  solarSystems: SolarSystemsIndex;
  setSolarSystems: (data: FixedGetSolarsystemsResponse) => void;
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
