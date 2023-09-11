import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';

export const AboutScreen = () => {
  return (
    <SafeAreaView>
      <Header title="About" />
    </SafeAreaView>
  );
};
