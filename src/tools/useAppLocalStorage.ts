import { useLocalStorage } from "@uidotdev/usehooks";
import z from "zod";

export function useAppLocalStorage<T extends z.AnyZodObject>(
  key: string,
  schema: T
): [z.infer<T>, (value: z.infer<T>) => void] {
  const [storeValue, setStoreValue] = useLocalStorage(key, {});

  const parsed = schema.safeParse(storeValue);
  // If the storage value is not valid, we will use the default value from the schema
  const value = parsed.success ? parsed.data : schema.parse({});

  function setValue(value: z.infer<T>) {
    const parsed = schema.safeParse(value);
    if (parsed.success) {
      setStoreValue(parsed.data);
    }
  }

  return [value, setValue] as const;
}
