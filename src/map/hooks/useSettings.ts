import z from "zod";
import { useAppLocalStorage } from "@/tools/useAppLocalStorage";

const settingsSchema = z.object({
  userDatabase: z.string().default("main"),
  lastImportOptions: z
    .object({
      method: z.enum(["replace", "merge", "merge-newer"]).default("merge"),
    })
    .default({
      method: "merge",
    }),
  lastExportOptions: z
    .object({
      updatedWithin: z.number().default(0),
    })
    .default({
      updatedWithin: 0,
    }),
  copy: z
    .object({
      numbering: z.boolean(),
      discordEmojis: z.boolean(),
      exclude: z.array(z.string()),
    })
    .default({
      numbering: false,
      discordEmojis: false,
      exclude: [],
    }),
});

export type Settings = z.infer<typeof settingsSchema>;

export function useSettings() {
  const [settings, setSettings] = useAppLocalStorage(
    "v2_systems_map_settings",
    settingsSchema
  );

  return {
    settings,
    setSettings,
  };
}
