import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AirDAOEventType, RootNavigationProp } from '@appTypes';
import { Cache, CacheKey } from '@lib/cache';
import { AirDAOEventDispatcher } from '@lib';
import { useCurrentRoute } from '@contexts';
import usePasscode from '@contexts/Passcode';

const APP_HIDDEN_STATES = ['inactive', 'background'];
const REQUIRE_DELAY_IN_SECONDS = __DEV__ ? 1000 : 2 * 60 * 1000;

const EXCLUDED_PASSCODE_ROUTES = ['SuccessSetupSecurity', 'ChangePasscode'];

export const usePasscodeEntryRevealer = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const currentRoute = useCurrentRoute();
  const { isPasscodeEnabled, isFaceIDEnabled, loading } = usePasscode();

  const prevAppState = useRef<AppStateStatus>(AppState.currentState);
  const timestampWhenFocused = useRef<number | null>(null);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        if (APP_HIDDEN_STATES.includes(prevAppState.current)) {
          const currentTime = new Date().getTime();

          // Findes difference between app state changed and redirect or return to correct screen
          const isTimestampDiffHaveRevealPass = timestampWhenFocused.current
            ? currentTime - timestampWhenFocused.current >
              REQUIRE_DELAY_IN_SECONDS
            : false;

          await Cache.setItem(
            CacheKey.isBiometricAuthenticationInProgress,
            false
          );

          if (isTimestampDiffHaveRevealPass) {
            if (isFaceIDEnabled || isPasscodeEnabled) {
              AirDAOEventDispatcher.dispatch(
                AirDAOEventType.CloseAllModals,
                null
              );
              setTimeout(() => {
                navigation.navigate('Passcode');
              }, 500);
            }
          }
        }
      }
      prevAppState.current = nextAppState;
    },
    [isFaceIDEnabled, isPasscodeEnabled, navigation]
  );

  useEffect(() => {
    // Final implementation of navigation & listener
    const appStateChangeListener = (nextAppState: AppStateStatus) => {
      if (!loading && !EXCLUDED_PASSCODE_ROUTES.includes(currentRoute)) {
        handleAppStateChange(nextAppState);
      }
    };

    AppState.addEventListener('change', appStateChangeListener);
  }, [currentRoute, loading, handleAppStateChange]);

  // Effect with app state listener & setting date when focused/hidden
  useEffect(() => {
    const focusListener = (nextAppState: AppStateStatus) => {
      if (APP_HIDDEN_STATES.includes(nextAppState)) {
        timestampWhenFocused.current = new Date().getTime();
      } else if (nextAppState === 'active') {
        timestampWhenFocused.current = null;
      }
    };

    AppState.addEventListener('change', focusListener);
  }, []);

  return null;
};
