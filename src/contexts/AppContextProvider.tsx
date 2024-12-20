import React from "react";
import { AppContext } from "./AppContext";
import { GetSolarsystemsResponse } from "../api/stillness";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [solarSystems, setSolarSystems] =
    React.useState<GetSolarsystemsResponse>({});

  return (
    <AppContext.Provider value={{ solarSystems, setSolarSystems }}>
      {children}
    </AppContext.Provider>
  );
};
