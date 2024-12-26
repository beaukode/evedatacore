import React from "react";
import { AppContext } from "./AppContext";
import { GetSolarsystemsResponse } from "../api/stillness";
import {
  createSolarSystemsIndex,
  SolarSystemsIndex,
} from "../tools/solarSystemsIndex";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [solarSystems, setSolarSystemsIndex] =
    React.useState<SolarSystemsIndex>(createSolarSystemsIndex({}));

  const setSolarSystems = React.useCallback((data: GetSolarsystemsResponse) => {
    const index = createSolarSystemsIndex(data);
    setSolarSystemsIndex(index);
  }, []);

  return (
    <AppContext.Provider value={{ solarSystems, setSolarSystems }}>
      {children}
    </AppContext.Provider>
  );
};
