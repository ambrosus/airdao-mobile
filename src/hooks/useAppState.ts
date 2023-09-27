import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [prevState, setPrevState] = useState<any>(null);
  const appStateRef = useRef(appState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appStateRef.current = nextAppState;
      setAppState((prevS) => {
        setPrevState(prevS);
        return nextAppState;
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return { appState, prevState };
};
