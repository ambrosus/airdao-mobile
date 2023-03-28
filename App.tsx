import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from './src/components/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <Text heading>Hello World!</Text>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
