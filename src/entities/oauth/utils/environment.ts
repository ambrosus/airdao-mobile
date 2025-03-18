import Constants from 'expo-constants';

export const AUTH_ENVIRONMENT = {
  clientId: Constants.expoConfig?.extra?.eas.W3A_CLIENT_ID,
  firebaseClientId: Constants.expoConfig?.extra?.eas.FIREBASE_OAUTH_CLIENT_ID,
  google: {
    provider: Constants.expoConfig?.extra?.eas.W3A_GOOGLE_PROVIDER
  },
  apple: {
    provider: Constants.expoConfig?.extra?.eas.W3A_APPLE_PROVIDER
  }
} as const;
