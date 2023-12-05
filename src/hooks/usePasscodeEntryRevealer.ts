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
    // if security has not setup yet do nothing
    if (!isPasscodeEnabled && !isFaceIDEnabled) {
      return;
    }
    // do nothing when app goes to background or comes back grom inactive state on IOS
    if (
      prevState === 'active' ||
      (DeviceUtils.isIOS && prevState === 'inactive')
    ) {
      return;
    }
    if (prevState === null) {
      // if app comes from killed state always show passcode entry
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
