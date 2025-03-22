import { useDebounce } from "@uidotdev/usehooks";
import React from "react";
import { useSearchParams } from "react-router";

const useQuerySearch = <S extends Record<string, string>>(
  initialState: S
): [
  S,
  (key: keyof S, value: string) => void,
  S,
  React.ChangeEventHandler<HTMLFormElement>,
] => {
  const isInitialState = React.useRef(true);
  const [searchParams, setSearchParams] = useSearchParams(initialState);

  const [state, setState] = React.useState<S>(() => {
    return [...searchParams.entries()].reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {} as S);
  });

  const debouncedState = useDebounce(state, 300);

  React.useEffect(() => {
    if (isInitialState.current) return;
    setSearchParams(
      () => {
        const next = new URLSearchParams();
        for (const key in debouncedState) {
          if (
            debouncedState[key] !== undefined &&
            debouncedState[key] !== initialState[key]
          ) {
            next.set(key, debouncedState[key]);
          }
        }
        return next;
      },
      { replace: true }
    );
    // initialState can be omited, it never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedState, setSearchParams]);

  const setValue = React.useCallback((key: keyof S, value: string) => {
    isInitialState.current = false;
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      const name = event.target.name;

      if (name && name in state) {
        if (event.target.type === "checkbox") {
          setValue(name as keyof S, event.target.checked ? "true" : "false");
        } else {
          setValue(name as keyof S, event.target.value);
        }
      }
    },
    [state, setValue]
  );

  return [state, setValue, debouncedState, handleChange];
};

export default useQuerySearch;
