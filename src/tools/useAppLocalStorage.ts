import { useLocalStorage } from "@uidotdev/usehooks";
import z from "zod";

export function useAppLocalStorage<T extends z.AnyZodObject>(
  key: string,
  schema: T
): [
  z.infer<T>,
  <P extends true | false = false>(
    value: P extends true ? Partial<z.infer<T>> : z.infer<T>,
    partial?: P
  ) => void,
] {
  const [storeValue, setStoreValue] = useLocalStorage(key, {});

  const parsed = schema.safeParse(storeValue);
  // If the storage value is not valid, we will use the default value from the schema
  const value = parsed.success ? parsed.data : schema.parse({});

  function setValue<P extends true | false = false>(
    value: P extends true ? Partial<z.infer<T>> : z.infer<T>,
    partial: P = false as P
  ) {
    const parsed = partial
      ? schema.partial().safeParse(value)
      : schema.safeParse(value);
    if (parsed.success) {
      if (partial) {
        setStoreValue((prev) => ({ ...prev, ...parsed.data }));
      } else {
        setStoreValue(parsed.data);
      }
    }
  }

  return [value, setValue] as const;
}
