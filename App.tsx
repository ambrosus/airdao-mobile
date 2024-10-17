import React from 'react';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from '@hooks/useAppInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Providers } from './Providers';
import { Toast } from '@components/modular';
import * as Sentry from '@sentry/react-native';

import Constants from 'expo-constants';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.eas.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0
  }
});

function App() {
  const { isAppReady } = useAppInit();
  if (!isAppReady) {
    return null;
  }

  return (
    // @ts-ignore
    <Providers>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
        <Toast />
      </GestureHandlerRootView>
    </Providers>
  );
}

export default Sentry.wrap(App);
