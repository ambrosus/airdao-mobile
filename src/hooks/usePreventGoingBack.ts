import { MutableRefObject, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export const usePreventGoingBack = (
  canGoBack: MutableRefObject<boolean>,
  callback?: () => unknown
) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      if (canGoBack.current) return;
      if (!canGoBack.current) {
        e.preventDefault();
      }
      if (typeof callback === 'function') callback();
    });
  }, [callback, canGoBack, navigation]);
};
