import React from "react";
import { setupSqlIndexer } from "./setupSqlIndexer";

type AppContextProps = {
  sqlIndexer?: Awaited<ReturnType<typeof setupSqlIndexer>>;
};

export const MudContext = React.createContext<AppContextProps | undefined>(
  undefined
);

export function useMudContext() {
  const context = React.useContext(MudContext);
  if (!context) {
    throw new Error("useMudContext must be used within an MudContextProvider");
  }
  return context;
}

export function useMudSqlIndexer() {
  const { sqlIndexer } = useMudContext();
  if (!sqlIndexer) {
    throw new Error("sqlIndexer is not ready");
  }
  return sqlIndexer;
}
