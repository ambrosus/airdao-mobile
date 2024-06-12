import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import {
  BottomSheetTokensList,
  SwapForm
} from '@features/swap/components/templates';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';

export const SwapScreen = () => {
  const { bottomSheetTokenARef, bottomSheetTokenBRef } =
    useSwapContextSelector();
  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title="Swap" />

      <SwapForm />

      <BottomSheetTokensList ref={bottomSheetTokenARef} type={FIELD.TOKEN_A} />
      <BottomSheetTokensList ref={bottomSheetTokenBRef} type={FIELD.TOKEN_B} />
    </SafeAreaView>
  );
};
