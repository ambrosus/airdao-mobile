import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useAppState = () => {
  const [state, setState] = useState<{
    appState: string;
    prevState: string | null;
  }>({
    appState: AppState.currentState,
    prevState: null
  });
  const appStateRef = useRef(state.appState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setState({
        appState: nextAppState,
        prevState: appStateRef.current
      });
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return { appState: state.appState, prevState: state.prevState };
};
