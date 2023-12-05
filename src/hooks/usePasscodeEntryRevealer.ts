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
    // if security has not setup yet or app goes to background do nothing
    if ((!isPasscodeEnabled && !isFaceIDEnabled) || prevState === 'active')
      return;
    // if app comes from killed state always show passcode entry
    if (prevState === null) {
      // reset biometric auth and setup security states
      await Promise.all([
        Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false),
        Cache.setItem(CacheKey.isSetupSecurityInProgress, false)
      ]);
      navigation.navigate('Passcode');
      return;
    }
    const [isBiometricAuthenticationInProgress, isSetupSecurityInProgress] =
      await Promise.all([
        Cache.getItem(CacheKey.isBiometricAuthenticationInProgress),
        Cache.getItem(CacheKey.isSetupSecurityInProgress)
      ]);
    /*
     on older android devices app activity state becomes inactive and then active
     leading this function to be called on every biometric auth request
     we are saving biometric auth progress state in local storage to avoid calling this function infinitely
     */
    if (
      (DeviceUtils.isAndroid &&
        isBiometricAuthenticationInProgress &&
        isFaceIDEnabled) ||
      isSetupSecurityInProgress
    ) {
      // reset state
      await Promise.all([
        Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false),
        Cache.setItem(CacheKey.isSetupSecurityInProgress, false)
      ]);
      return;
    }
    navigation.navigate('Passcode');
  }, [isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);

  useEffect(() => {
    if (!loading) {
      processPasscodeReveal();
    }
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
