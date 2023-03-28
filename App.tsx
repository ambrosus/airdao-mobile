import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from './src/hooks/useAppInit';

export default function App() {
  const { isAppReady } = useAppInit();

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}
