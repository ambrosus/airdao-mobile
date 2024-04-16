import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, RootNavigationProp } from '@appTypes';
import { useAppState } from './useAppState';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';
import { AirDAOEventDispatcher } from '@lib';
import { useCurrentRoute } from '@contexts';

const routesToIgnorePasscodeEntry = ['SuccessSetupSecurity', 'ChangePasscode'];

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const currentRoute = useCurrentRoute();
  const { prevState, appState } = useAppState();
  const {
    isPasscodeEnabled,
    isFaceIDEnabled,
    loading
    // temporarily hide
    // isRequestingPermission
  } = usePasscode();
  const processPasscodeReveal = useCallback(async () => {
    const isBiometricAuthenticationInProgress = await Cache.getItem(
      CacheKey.isBiometricAuthenticationInProgress
    );
    // all IOS devices and some Android devices triggers inactive app state whenever we request a biometric authentication (faceId, fingerprint or iris). This state in cache is a workaround to make sure that we do not fire passcode entry state during those transitions.
    if (isBiometricAuthenticationInProgress) {
      if (appState === 'inactive' && prevState === 'active') return;
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
      return;
    }
    if (prevState === 'active' && (isFaceIDEnabled || isPasscodeEnabled)) {
      // Our BottomSheet component is rendered on top of all screens,meaning that if any modal that is open stays open during this transition,
      // so we close all open instance of BottomSheet navigating to Passcode
      AirDAOEventDispatcher.dispatch(AirDAOEventType.CloseAllModals, null);
      setTimeout(() => {
        navigation.navigate('Passcode');
      }, 500);
    }
  }, [appState, isFaceIDEnabled, isPasscodeEnabled, navigation, prevState]);
  // temporarily hide
  // const ignoreRequestingPassword = Platform.select({
  //   android: !isRequestingPermission && prevState !== 'active',
  //   ios: !isRequestingPermission
  // });

  useEffect(() => {
    if (
      !loading &&
      !routesToIgnorePasscodeEntry.includes(currentRoute)
      // temporarily hide
      // && ignoreRequestingPassword
    ) {
      processPasscodeReveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, prevState, loading, processPasscodeReveal]);
};
