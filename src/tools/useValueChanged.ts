import React from "react";

// From: https://gist.github.com/madflanderz/dc185464344c9cd48877a9383fcce862
function useValueChanged<T>(callback: (value: T) => void, value: T) {
  // save initial value on first call
  const ref = React.useRef<T | null>(null);

  // execute callback when value has changed
  if (ref.current !== value) {
    ref.current = value;
    callback(value);
  }
}

export default useValueChanged;
