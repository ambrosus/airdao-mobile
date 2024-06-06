import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { PrimaryButton } from '@components/modular';
import { Text } from '@components/base';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';

export const SwapButton = () => {
  const { selectedTokensAmount, selectedTokens } = useDEXSwapContextSelector();

  const onSwap = () => {
    Alert.alert('Swap');
  };

  const USDPrice = useUSDPrice(
    selectedTokensAmount.INPUT,
    selectedTokens.OUTPUT?.symbol
  );

  console.log(
    USDPrice,
    selectedTokensAmount,
    selectedTokens.OUTPUT?.symbol,
    'USD Price'
  );

  const isEmptyAmount = useMemo(() => {
    return (
      selectedTokensAmount.INPUT === '' || selectedTokensAmount.OUTPUT === ''
    );
  }, [selectedTokensAmount]);

  const buttonLabel = useMemo(() => {
    if (isEmptyAmount) {
      return 'Enter amount';
    }
    return 'Swap';
  }, [isEmptyAmount]);

  return (
    <PrimaryButton
      colors={
        isEmptyAmount
          ? [COLORS.neutral100, COLORS.neutral100]
          : ['#3668DD', '#3668DD']
      }
      onPress={onSwap}
    >
      <Text color={isEmptyAmount ? COLORS.neutral400 : COLORS.neutral0}>
        {buttonLabel}
      </Text>
    </PrimaryButton>
  );
};
