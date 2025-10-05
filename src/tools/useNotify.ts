import React from "react";

export function useNotify(trigger: boolean, callback?: () => void) {
  const hasCalledReady = React.useRef(false);

  React.useEffect(() => {
    if (callback && trigger && !hasCalledReady.current) {
      callback();
      hasCalledReady.current = true;
    }
  }, [trigger, callback]);
}
