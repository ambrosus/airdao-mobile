import React from 'react';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '@components/modular';
import { useAppInit } from '@hooks/useAppInit';
import Navigation from '@navigation/NavigationContainer';
import { Providers } from './Providers';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.eas.SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0
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
