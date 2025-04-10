import { ComponentType } from 'react';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import Config from '@constants/config';

type SentryProviderComponent = ComponentType<Record<string, unknown>>;

const PRODUCTION = 'prod';
const hasInitClient = !__DEV__ && Config.env !== PRODUCTION;

export const initSentryClient = () => {
  if (!hasInitClient) return;

  console.warn('Sentry client initialized');

  const replayIntegration = Sentry.mobileReplayIntegration({
    maskAllText: true,
    maskAllImages: true,
    maskAllVectors: true
  });

  Sentry.init({
    dsn: Constants.expoConfig?.extra?.eas?.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [replayIntegration]
  });

  // Capture console warnings and errors
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    Sentry.captureMessage(`[console.warn] ${args.join(' ')}`, 'warning');
    originalWarn(...args);
  };

  console.error = (...args) => {
    Sentry.captureMessage(`[console.error] ${args.join(' ')}`, 'error');
    originalError(...args);
  };

  // Handle unhandled JS exceptions
  const defaultErrorHandler = ErrorUtils.getGlobalHandler?.();

  ErrorUtils.setGlobalHandler?.((error, isFatal) => {
    Sentry.captureException(error);
    defaultErrorHandler?.(error, isFatal);
  });
};

export const withSentryProvider = (children: SentryProviderComponent) => {
  if (hasInitClient) return Sentry.wrap(children);

  return children;
};

export { Sentry };
