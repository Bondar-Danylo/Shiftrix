import { useEffect, useState } from "react";

export const useDebounce = <T,>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(():void => {
      setDebouncedValue(value);
    }, delay);

    return ():void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};