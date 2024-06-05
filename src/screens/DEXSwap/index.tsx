import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import { SwapForm } from '@features/dex-swap-interface/components/templates';

export const DEXSwapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title="Swap" />

      <SwapForm />
    </SafeAreaView>
  );
};
