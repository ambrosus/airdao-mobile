import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from './useAppState';

const useAppFocus = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigationIsFocused = useIsFocused();
  const { appState } = useAppState();

  useEffect(() => {
    setIsFocused(navigationIsFocused && appState === 'active');
  }, [navigationIsFocused, appState]);

  return isFocused;
};

export default useAppFocus;
