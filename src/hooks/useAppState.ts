import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const appStateRef = useRef(appState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appStateRef.current = nextAppState;
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return appState;
};
