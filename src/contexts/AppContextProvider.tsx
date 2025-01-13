import React from "react";
import { FixedGetSolarsystemsResponse } from "@/api/stillness";
import {
  createSolarSystemsIndex,
  SolarSystemsIndex,
} from "@/tools/solarSystemsIndex";
import { AppContext } from "./AppContext";
import { createClient } from "@/api/mudsql";
import { indexerBaseUrl, worldAddress } from "@/constants";

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [solarSystems, setSolarSystemsIndex] =
    React.useState<SolarSystemsIndex>(createSolarSystemsIndex({}));

  const setSolarSystems = React.useCallback(
    (data: FixedGetSolarsystemsResponse) => {
      const index = createSolarSystemsIndex(data);
      setSolarSystemsIndex(index);
    },
    []
  );

  const mudSql = React.useMemo(
    () => createClient({ indexerBaseUrl, worldAddress }),
    []
  );

  return (
    <AppContext.Provider value={{ solarSystems, setSolarSystems, mudSql }}>
      {children}
    </AppContext.Provider>
  );
};
