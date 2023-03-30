import { ForwardedRef, RefObject, useEffect, useRef } from 'react';

export const useForwardedRef = <T>(
  forwardedRef: ForwardedRef<T>
): RefObject<T> => {
  const innerRef = useRef<T>(null);
  useEffect(() => {
    if (!forwardedRef) {
      return;
    }
    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
    } else {
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
};
