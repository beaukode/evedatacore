import React from "react";
import { MainDatabase, UserDatabase } from "../db";

interface SystemsMapContextProps {
  mainDatabase: MainDatabase;
  userDatabase: UserDatabase;
}

export const SystemsMapContext = React.createContext<
  SystemsMapContextProps | undefined
>(undefined);

export function useSystemsMapContext() {
  const context = React.useContext(SystemsMapContext);
  if (!context) {
    throw new Error(
      "useSystemsMapContext must be used within an SystemsMapContextProvider"
    );
  }
  return context;
}
