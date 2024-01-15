import React, { useCallback, useRef } from 'react';
import { ToastOptions } from './Toast.types';
import { ToastWrapper } from './Toast.wrapper';
let refs: any[] = [];
function addNewRef(newRef: any) {
  refs.push({
    current: newRef
  });
}

function removeOldRef(oldRef: any) {
  refs = refs.filter((r) => r.current !== oldRef);
}

function getRef() {
  const reversePriority = [...refs].reverse();
  const activeRef = reversePriority.find((ref) => ref?.current !== null);
  if (!activeRef) {
    return null;
  }
  return activeRef.current;
}

export const Toast = (): JSX.Element => {
  const toastRef = useRef(null);

  // TODO fix ref type
  const setRef = useCallback((ref: any) => {
    if (ref) {
      toastRef.current = ref;
      addNewRef(ref);
    } else {
      removeOldRef(ref);
    }
  }, []);
  return <ToastWrapper ref={setRef} />;
};

Toast.show = (params: ToastOptions) => {
  getRef()?.show(params);
};

Toast.hide = () => {
  getRef()?.hide();
};

export * from './Toast.types';
export * from './Toast.body';
