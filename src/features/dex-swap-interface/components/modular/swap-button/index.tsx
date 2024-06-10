import React, { useCallback, useMemo } from 'react';
import { PrimaryButton } from '@components/modular';
import { Spinner, Text } from '@components/base';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { COLORS } from '@constants/colors';
import {
  useDEXSwapAllowance,
  useDEXSwapBalance
} from '@features/dex-swap-interface/lib';
import { FIELD } from '@features/dex-swap-interface/types/fields';

export const SwapButton = () => {
  const { isAllowanceLower, increaseAllowance, isAllowanceProcessing } =
    useDEXSwapAllowance();
  const { selectedTokensAmount, selectedTokens } = useDEXSwapContextSelector();
  const { selectedTokenBalance } = useDEXSwapBalance(selectedTokens.INPUT);

  const isEmptyAmount = useMemo(() => {
    return (
      selectedTokensAmount.INPUT === '' || selectedTokensAmount.OUTPUT === ''
    );
  }, [selectedTokensAmount]);

  const onSwap = useCallback(() => {
    if (!isAllowanceProcessing) {
      increaseAllowance();
    }
  }, [increaseAllowance, isAllowanceProcessing]);

  const buttonLabel = useMemo(() => {
    if (isEmptyAmount) {
      return 'Enter amount';
    } else if (isAllowanceLower) {
      return 'Increase allowance';
    } else if (
      selectedTokenBalance.beatufied &&
      +selectedTokenBalance.beatufied < +selectedTokensAmount[FIELD.INPUT]
    ) {
      return 'Insufficient funds';
    }

    return 'Swap';
  }, [
    isAllowanceLower,
    isEmptyAmount,
    selectedTokenBalance.beatufied,
    selectedTokensAmount
  ]);

  return (
    <PrimaryButton
      colors={
        isEmptyAmount
          ? [COLORS.neutral100, COLORS.neutral100]
          : ['#3668DD', '#3668DD']
      }
      onPress={onSwap}
    >
      {isAllowanceProcessing ? (
        <Spinner size="small" />
      ) : (
        <Text color={isEmptyAmount ? COLORS.neutral400 : COLORS.neutral0}>
          {buttonLabel}
        </Text>
      )}
    </PrimaryButton>
  );
};
