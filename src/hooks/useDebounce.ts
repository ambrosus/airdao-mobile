import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 5000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
  return debouncedValue;
}
