import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import { InputWithCurrencySelector } from '@features/dex-swap-interface/components/modular';
import { Spacer } from '@components/base';
import { scale } from '@utils/scaling';

export const DEXSwapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title="Swap" />

      <View style={styles.inner}>
        <Spacer value={scale(22)} />
        <InputWithCurrencySelector type="INPUT" />
      </View>
    </SafeAreaView>
  );
};
