import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from '@hooks/useAppInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';

export default function App() {
  const { isAppReady } = useAppInit();

  if (!isAppReady) {
    return null;
  }

  return (
    <PortalProvider>
      <SafeAreaProvider style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Navigation />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PortalProvider>
  );
}
