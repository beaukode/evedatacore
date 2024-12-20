import React from "react";
import { GetSolarsystemsResponse } from "../api/stillness";

interface AppContextProps {
  solarSystems: GetSolarsystemsResponse;
  setSolarSystems: React.Dispatch<
    React.SetStateAction<GetSolarsystemsResponse>
  >;
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
