import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from './src/hooks/useAppInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text } from './src/components/base';

export default function App() {
  const { isAppReady } = useAppInit();

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Navigation />
        <Text heading>Hello World!</Text>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
