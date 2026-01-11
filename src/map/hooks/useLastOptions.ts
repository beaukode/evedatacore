import z from "zod";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";

const lastOptionsSchema = z.object({
  id: z.number().int().positive().default(30005122),
});

export type LastOptions = z.infer<typeof lastOptionsSchema>;

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
