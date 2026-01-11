import { getContext } from "typed-redux-saga";
import z from "zod";

export type LocalStorageSagaContext<T> = {
  getValue: () => T;
  setValue: <P extends true | false = false>(
    value: P extends true ? Partial<T> : T,
    partial: P
  ) => void;
};

export function createLocalStorageSagaContext<T extends z.AnyZodObject>(
  key: string,
  schema: T
) {
  function getValue() {
    const rawValue = localStorage.getItem(key);
    const parsed = schema.safeParse(rawValue ? JSON.parse(rawValue) : {});
    const value = parsed.success ? parsed.data : schema.parse({});
    return value;
  }

  function setValue<P extends true | false = false>(
    value: P extends true ? Partial<z.infer<T>> : z.infer<T>,
    partial: P = false as P
  ) {
    let newRawValue: string | undefined;
    const parsed = partial
      ? schema.partial().safeParse(value)
      : schema.safeParse(value);
    if (parsed.success) {
      if (partial) {
        newRawValue = JSON.stringify({ ...getValue(), ...parsed.data });
      } else {
        newRawValue = JSON.stringify(parsed.data);
      }
    }
    if (newRawValue) {
      localStorage.setItem(key, newRawValue);
    }
  }

  return {
    getValue,
    setValue,
  };
}

export function* getLocalStorageSagaContext<T extends z.AnyZodObject>(
  key: string
) {
  const context = yield* getContext<LocalStorageSagaContext<T>>(key);
  return context;
}
