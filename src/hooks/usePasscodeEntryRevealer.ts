import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';
import { AirDAOEventDispatcher } from '@lib';

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { prevState, appState } = useAppState();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();

  const processPasscodeReveal = useCallback(async () => {
    const isSetupSecurityInProgress = await Cache.getItem(
      CacheKey.isSetupSecurityInProgress
    );
    const isBiometricAuthenticationInProgress = await Cache.getItem(
      CacheKey.isBiometricAuthenticationInProgress
    );
    if (isSetupSecurityInProgress) {
      if (appState === 'inactive' && prevState === 'active') return;
      await Cache.setItem(CacheKey.isSetupSecurityInProgress, false);
      return;
    }

    if (isBiometricAuthenticationInProgress) {
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
      return;
    }
    if (prevState === 'active' && (isFaceIDEnabled || isPasscodeEnabled)) {
      // Our BottomSheet component is rendered on top of all screens,
      // so any open instance of BottomSheet must be closed before navigating to Passcode
      AirDAOEventDispatcher.dispatch(AirDAOEventType.CloseAllModals, null);
      setTimeout(() => {
        navigation.navigate('Passcode');
      }, 500);
    }
  }, [appState, isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);

  useEffect(() => {
    if (!loading) {
      processPasscodeReveal();
    }
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
