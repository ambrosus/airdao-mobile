import React, { useCallback, useMemo, useState } from 'react';
import { PrimaryButton } from '@components/modular';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapInterface,
  useSwapMultiplyBalance
} from '@features/swap/lib/hooks';
import { buttonActionString } from '@features/swap/utils/button-action.string';

export const ReviewSwapButton = () => {
  const { bnBalances } = useSwapMultiplyBalance();
  const { selectedTokens, selectedTokensAmount, lastChangedInput } =
    useSwapContextSelector();

  const { resolveBottomSheetData } = useSwapInterface();

  const [isProcessingBottomSheet, setIsProcessingBottomSheet] = useState(false);

  const swapButtonString = useMemo(() => {
    return buttonActionString(
      selectedTokens,
      selectedTokensAmount,
      bnBalances,
      lastChangedInput
    );
  }, [bnBalances, lastChangedInput, selectedTokens, selectedTokensAmount]);

  const onResolveBottomSheetDataPress = useCallback(async () => {
    try {
      setIsProcessingBottomSheet(true);
      await resolveBottomSheetData();
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingBottomSheet(false);
    }
  }, [resolveBottomSheetData]);

  const disabled = useMemo(() => {
    return swapButtonString !== 'Review swap' || isProcessingBottomSheet;
  }, [swapButtonString, isProcessingBottomSheet]);

  return (
    <PrimaryButton disabled={disabled} onPress={onResolveBottomSheetDataPress}>
      <Text color={disabled ? COLORS.alphaBlack30 : COLORS.neutral0}>
        {swapButtonString}
      </Text>
    </PrimaryButton>
  );
};
