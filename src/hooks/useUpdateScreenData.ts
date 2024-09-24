import { useAppState } from '@hooks/useAppState';
import { useEffect } from 'react';

const APP_STATES = {
  inactive: 'inactive',
  background: 'background',
  active: 'active'
};

export const useUpdateScreenData = (
  updateFn: () => Promise<void>,
  delay = 0
) => {
  const { appState, prevState } = useAppState();
  const { inactive, background, active } = APP_STATES;
  const inActiveStates = [inactive, background];

  useEffect(() => {
    if (inActiveStates.includes(prevState || '') && appState === active) {
      setTimeout(() => {
        updateFn().then();
      }, delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevState]);
};
