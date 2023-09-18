import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';

export const SecuritySettingsScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Security Settings" />
    </SafeAreaView>
  );
};
