import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, RootNavigationProp } from '@appTypes';
import { useCurrentRoute } from '@contexts';
import { usePasscodeStore } from '@features/passcode/model';
import { AirDAOEventDispatcher } from '@lib';
import { Cache, CacheKey } from '@lib/cache';

const APP_HIDDEN_STATES = ['inactive', 'background'];
const REQUIRE_DELAY_IN_SECONDS = 2 * 60 * 1000;

const EXCLUDED_PASSCODE_ROUTES = ['SuccessSetupSecurity', 'ChangePasscode'];

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const currentRoute = useCurrentRoute();
  const { isFaceIDEnabled, isPasscodeEnabled, loading } = usePasscodeStore();

  const prevAppState = useRef<AppStateStatus>(AppState.currentState);
  const timestampWhenHidden = useRef<number | null>(null);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (
        prevAppState.current === 'active' &&
        APP_HIDDEN_STATES.includes(nextAppState)
      ) {
        // App is moving to the background
        timestampWhenHidden.current = Date.now();
      }

      if (nextAppState === 'active') {
        // App is moving to the foreground
        const currentTime = Date.now();

        if (timestampWhenHidden.current) {
          const timeDiff = currentTime - timestampWhenHidden.current;

          if (timeDiff > REQUIRE_DELAY_IN_SECONDS) {
            // Require authentication if the time difference is greater than the set delay
            const isBiometricAuthenticationInProgress = await Cache.getItem(
              CacheKey.isBiometricAuthenticationInProgress
            );

            if (
              !isBiometricAuthenticationInProgress &&
              (isPasscodeEnabled || isFaceIDEnabled) &&
              !EXCLUDED_PASSCODE_ROUTES.includes(currentRoute)
            ) {
              AirDAOEventDispatcher.dispatch(
                AirDAOEventType.CloseAllModals,
                null
              );
              setTimeout(() => {
                navigation.navigate('Passcode');
              }, 500);
              timestampWhenHidden.current = null;
            }
          }
        }
      }

      prevAppState.current = nextAppState;
    },
    [isPasscodeEnabled, isFaceIDEnabled, navigation, currentRoute]
  );

  useEffect(() => {
    const appStateChangeListener = (nextAppState: AppStateStatus) => {
      if (!loading) {
        handleAppStateChange(nextAppState);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      appStateChangeListener
    );

    return () => {
      subscription.remove();
    };
  }, [loading, handleAppStateChange]);

  useEffect(() => {
    const focusListener = (nextAppState: AppStateStatus) => {
      if (APP_HIDDEN_STATES.includes(nextAppState)) {
        timestampWhenHidden.current = Date.now();
      }
    };

    AppState.addEventListener('change', focusListener);
  }, []);

  return;
};
