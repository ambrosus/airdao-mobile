import React from 'react';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from '@hooks/useAppInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Providers } from './Providers';
import './src/prototypes/array';

export default function App() {
  const { isAppReady } = useAppInit();

  if (!isAppReady) {
    return null;
  }

  return (
    // @ts-ignore
    <Providers>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
      </GestureHandlerRootView>
    </Providers>
  );
}
