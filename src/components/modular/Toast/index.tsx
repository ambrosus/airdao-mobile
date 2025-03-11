import { useCallback, useRef } from 'react';
import { ToastOptions, ToastRef } from './Toast.types';
import { ToastWrapper } from './Toast.wrapper';

const toastRefs: ToastRef[] = [];

export const Toast = () => {
  const toastRef = useRef<ToastRef | null>(null);

  const setRef = useCallback((ref: ToastRef) => {
    if (ref) {
      toastRef.current = ref;
      toastRefs.push(toastRef.current);
    }
  }, []);

  return <ToastWrapper ref={setRef} />;
};

Toast.show = (params: ToastOptions) => {
  toastRefs.forEach((ref) => {
    ref.show(params);
  });
};

Toast.hide = () => {
  toastRefs.forEach((ref) => {
    ref.hide();
  });
};

export * from './Toast.types';
export * from './Toast.body';
