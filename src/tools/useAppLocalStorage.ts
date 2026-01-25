import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import z from "zod";

export function useAppLocalStorage<T extends z.AnyZodObject>(
  key: string,
  schema: T,
): [z.infer<T>, React.Dispatch<React.SetStateAction<z.infer<T>>>] {
  const [storeValue, setStoreValue] = useLocalStorage<z.infer<T>>(key, {});

  const parsed = schema.safeParse(storeValue);
  // If the storage value is not valid, we will use the default value from the schema
  const value = parsed.success ? parsed.data : schema.parse({});

  const setValue = React.useCallback(
    function (value: React.SetStateAction<z.infer<T>>) {
      if (typeof value === "function") {
        setStoreValue((prev) => {
          const next = value(prev);
          const parsed = schema.safeParse(next);
          return parsed.success ? parsed.data : schema.parse({});
        });
      } else {
        const parsed = schema.safeParse(value);
        if (parsed.success) {
          setStoreValue(parsed.data);
        }
      }
    },
    [schema, setStoreValue],
  );

  return [value, setValue];
}
