import { useAppLocalStorage } from "@/tools/useAppLocalStorage";
import { lastOptionsSchema } from "../common";

export function useLastOptions() {
  const [lastOptions, setLastOptions] = useAppLocalStorage(
    "v2_map_last_options",
    lastOptionsSchema
  );

  return {
    lastOptions,
    setLastOptions,
  };
}
