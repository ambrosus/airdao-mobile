import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { prevState } = useAppState();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();

  const processPasscodeReveal = useCallback(async () => {
    if (!isPasscodeEnabled && !isFaceIDEnabled) return;
    if (prevState === null) {
      navigation.navigate('Passcode');
      return;
    }
    if (prevState === 'background') {
      const isBiometricAuthenticationInProgress = await Cache.getItem(
        CacheKey.isBiometricAuthenticationInProgress
      );
      if (!isFaceIDEnabled || isBiometricAuthenticationInProgress === 'false') {
        navigation.navigate('Passcode');
      }
    }
  }, [isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);

  useEffect(() => {
    if (!loading) {
      processPasscodeReveal();
    }
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
