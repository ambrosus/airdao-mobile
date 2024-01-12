import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';
import { AirDAOEventDispatcher } from '@lib';
import { useCurrentRoute } from '@contexts';

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const currentRoute = useCurrentRoute();
  const { prevState, appState } = useAppState();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();

  const processPasscodeReveal = useCallback(async () => {
    const isBiometricAuthenticationInProgress = await Cache.getItem(
      CacheKey.isBiometricAuthenticationInProgress
    );
    if (isBiometricAuthenticationInProgress) {
      if (appState === 'inactive' && prevState === 'active') return;
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
    if (
      !loading &&
      !['SuccessSetupSecurity', 'ChangePasscode'].includes(currentRoute)
    ) {
      processPasscodeReveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
