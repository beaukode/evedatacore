import React from "react";
import { useSolarSystemsIndex } from "@/contexts/AppContext";
import { tsToLocaleString } from "@/tools";
import { useSettings } from "./useSettings";
import { SystemRecord } from "@/api/userdata";

const emojis = [
  ":one:",
  ":two:",
  ":three:",
  ":four:",
  ":five:",
  ":six:",
  ":seven:",
  ":eight:",
  ":nine:",
  ":keycap_ten:",
];

function getNumbering(
  index: number,
  numbering: boolean,
  discordEmojis: boolean
) {
  if (!numbering) return "";
  if (!discordEmojis || index >= emojis.length) return `[${index + 1}] `;
  return `${emojis[index]} `;
}

export function useSystemDataCopy() {
  const solarSystemsIndex = useSolarSystemsIndex();
  const { settings } = useSettings();

  const copy = React.useCallback(
    async (data: SystemRecord) => {
      const { numbering, discordEmojis, exclude } = settings.copy;
      const system = solarSystemsIndex?.getById(data.id);
      const parts: string[] = [];
      if (system) {
        parts.push(system.name);
      }
      const content = [...(data.content ?? [])];
      content
        .sort()
        .filter((content) => !exclude.includes(content))
        .forEach((content, index) => {
          const prefix = getNumbering(index, numbering, discordEmojis);
          parts.push(`${prefix}${content}`);
        });

      if (data.notes && data.notes.trim().length > 0) {
        parts.push(data.notes);
      }
      parts.push(tsToLocaleString(data.updatedAt, { time: true }));
      await navigator.clipboard.writeText(parts.join(" - "));
    },
    [settings.copy, solarSystemsIndex]
  );

  return {
    copy,
  };
}
