import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';
import { DeviceUtils } from '@utils/device';

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { prevState } = useAppState();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();

  const processPasscodeReveal = useCallback(async () => {
    const [isBiometricAuthenticationInProgress, isSetupSecurityInProgress] =
      await Promise.all([
        Cache.getItem(CacheKey.isBiometricAuthenticationInProgress),
        Cache.getItem(CacheKey.isSetupSecurityInProgress)
      ]);

    if (
      DeviceUtils.isAndroid &&
      isBiometricAuthenticationInProgress &&
      isFaceIDEnabled
    ) {
      // check is authentication is still in progress for older android devices
      return;
    }
    if (isSetupSecurityInProgress) return;
    if (!isPasscodeEnabled && !isFaceIDEnabled) return;
    if (prevState === 'active' || prevState === 'inactive') return;
    navigation.navigate('Passcode');
  }, [isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);

  useEffect(() => {
    if (!loading) {
      processPasscodeReveal();
    }
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
