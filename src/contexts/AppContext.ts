import React from "react";
import { getSolarsystems } from "@/api/stillness";
import { createSolarSystemsIndex } from "@/tools/solarSystemsIndex";
import { MudSqlClient } from "@/api/mudsql";
import { useQuery } from "@tanstack/react-query";

interface AppContextProps {
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

export function useMudSql() {
  const { mudSql } = useAppContext();
  return mudSql;
}

export function useSolarSystemsIndex() {
  const query = useQuery({
    queryKey: ["Solarsystems"],
    queryFn: async () =>
      getSolarsystems().then((r) => createSolarSystemsIndex(r.data)),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query.data;
}
