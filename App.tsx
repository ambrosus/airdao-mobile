import React, { useEffect } from 'react';
import Navigation from '@navigation/NavigationContainer';
import { useAppInit } from '@hooks/useAppInit';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Providers } from './Providers';
import { Toast } from '@components/modular';
import './src/prototypes/array';
import Permissions from '@utils/permissions';

export default function App() {
  const { isAppReady } = useAppInit();
  useEffect(() => {
    Permissions.requestPermissions();
  }, []);

  useEffect(() => {
    Permissions.requestPermissions();
  }, []);

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
