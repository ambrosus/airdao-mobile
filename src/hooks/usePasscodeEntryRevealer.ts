import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';
import { DeviceUtils } from '@utils/device';

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

    // hack around old android devices
    if (DeviceUtils.isAndroid && isBiometricAuthenticationInProgress) {
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
      return;
    }
    if (prevState === 'active' && (isFaceIDEnabled || isPasscodeEnabled)) {
      navigation.navigate('Passcode');
    }
  }, [appState, isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);

  useEffect(() => {
    if (!loading) {
      processPasscodeReveal();
    }
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
