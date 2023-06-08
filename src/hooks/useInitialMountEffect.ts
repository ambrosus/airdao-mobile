import { useEffect, useRef } from 'react';

export const useInitialMountEffect = (fn: () => unknown, when: boolean) => {
  const initialMount = useRef(true);

  useEffect(() => {
    if (when && initialMount.current) {
      fn();
    }
  }, [when, fn]);
};
