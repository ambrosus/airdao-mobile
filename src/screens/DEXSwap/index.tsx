import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { useFocusEffect } from '@react-navigation/native';
import { SwapForm } from '@features/dex-swap-interface/components/modular';

export const DEXSwapScreen = () => {
  const { reset } = useDEXSwapContextSelector();

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [reset])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title="Swap" />

      <SwapForm />
    </SafeAreaView>
  );
};
