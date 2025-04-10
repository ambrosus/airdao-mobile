import { ComponentType } from 'react';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import Config from '@constants/config';

type SentryProviderComponent = ComponentType<Record<string, unknown>>;

const PRODUCTION = 'prod';

export const initSentryClient = () => {
  if (!__DEV__ && Config.env !== PRODUCTION) {
    return Sentry.init({
      dsn: Constants.expoConfig?.extra?.eas.SENTRY_DSN,
      sendDefaultPii: true,
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0
    });
  }
};

export const withSentryProvider = (children: SentryProviderComponent) => {
  if (!__DEV__ && Config.env !== PRODUCTION) {
    return Sentry.wrap(children);
  }

  return children;
};

export { Sentry };
