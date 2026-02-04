import React from "react";
import { Hex } from "viem";
import { getTypes } from "@/api/stillness";
import { createSolarSystemsIndex } from "@/tools/solarSystemsIndex";
import { useQuery } from "@tanstack/react-query";
import { createTypesIndex } from "@/tools/typesIndex";
import { MudWeb3Client } from "@/api/mudweb3";
import { staticVersion } from "@/config";

export type SmartCharacter =
  | {
      isConnected: false;
      isConnecting: boolean;
    }
  | {
      isConnected: true;
      isConnecting: boolean;
      address: Hex;
      characterId?: bigint;
      characterName?: string;
    };

interface AppContextProps {
  mudWeb3: MudWeb3Client;
  showConnectDialog: () => void;
  pushTrackingEvent: (key: string) => void;
  smartCharacter: SmartCharacter;
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

export function useMudWeb3() {
  const { mudWeb3 } = useAppContext();
  return mudWeb3;
}

export function useShowConnectDialog() {
  const { showConnectDialog } = useAppContext();
  return showConnectDialog;
}

export function useSolarSystemsIndex() {
  const query = useQuery({
    queryKey: ["SolarsystemsIndex"],
    queryFn: async () => {
      const data = await fetch(`/static/${staticVersion}/systems_index.json`);
      const json = await data.json();
      return createSolarSystemsIndex(json);
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query.data;
}

export function useTypesIndex() {
  const query = useQuery({
    queryKey: ["Types"],
    queryFn: async () => getTypes().then((r) => createTypesIndex(r.data)),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query.data;
}

export function usePushTrackingEvent() {
  const { pushTrackingEvent } = useAppContext();
  return pushTrackingEvent;
}

export function useSmartCharacter() {
  const { smartCharacter } = useAppContext();
  return smartCharacter;
}
