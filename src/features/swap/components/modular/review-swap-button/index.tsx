import React, { useMemo } from 'react';
import { PrimaryButton } from '@components/modular';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapBottomSheetHandler,
  useSwapMultiplyBalance
} from '@features/swap/lib/hooks';
import { buttonActionString } from '@features/swap/utils/button-action.string';

export const ReviewSwapButton = () => {
  const { bnBalances } = useSwapMultiplyBalance();
  const { onReviewSwapPreview } = useSwapBottomSheetHandler();
  const { selectedTokens, selectedTokensAmount, lastChangedInput } =
    useSwapContextSelector();

  const swapButtonString = useMemo(() => {
    return buttonActionString(
      selectedTokens,
      selectedTokensAmount,
      bnBalances,
      lastChangedInput
    );
  }, [bnBalances, lastChangedInput, selectedTokens, selectedTokensAmount]);

  const disabled = useMemo(() => {
    return swapButtonString !== 'Review swap';
  }, [swapButtonString]);

  return (
    <PrimaryButton disabled={disabled} onPress={onReviewSwapPreview}>
      <Text color={disabled ? COLORS.alphaBlack30 : COLORS.neutral0}>
        {swapButtonString}
      </Text>
    </PrimaryButton>
  );
};
