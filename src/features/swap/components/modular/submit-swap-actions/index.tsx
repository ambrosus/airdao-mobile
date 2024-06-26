import React, { useCallback } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapActions,
  useSwapBottomSheetHandler
} from '@features/swap/lib/hooks';
import {
  SwapErrorImpactButton,
  ApprovalRequiredButton,
  SwapButton
} from '../../base/swap-buttons-list';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

export const SubmitSwapActions = () => {
  const navigation: HomeNavigationProp = useNavigation();
  const {
    uiBottomSheetInformation,
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreassingAllowance,
    _refExactGetter,
    selectedTokens,
    selectedTokensAmount
  } = useSwapContextSelector();

  const { setAllowance, swapTokens } = useSwapActions();
  const { onReviewSwapDismiss } = useSwapBottomSheetHandler();

  const simulateNavigationDelay = useCallback(
    async (navigate: () => void) => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      onReviewSwapDismiss();

      await delay(320);

      navigate();
      setIsProcessingSwap(false);
    },
    [onReviewSwapDismiss, setIsProcessingSwap]
  );

  const prepareRouteParams = useCallback(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    const routeParams = {
      AMOUNT_A: _refExactGetter ? AMOUNT_A : AMOUNT_B,
      AMOUNT_B: _refExactGetter ? AMOUNT_B : AMOUNT_A,
      SYMBOL_A: _refExactGetter ? TOKEN_A?.symbol : TOKEN_B?.symbol,
      SYMBOL_B: _refExactGetter ? TOKEN_B?.symbol : TOKEN_A?.symbol
    };

    return routeParams as any;
  }, [_refExactGetter, selectedTokens, selectedTokensAmount]);

  const onCompleteMultiStepSwap = useCallback(async () => {
    const routeParams = prepareRouteParams();
    if (uiBottomSheetInformation.allowance === 'increase') {
      try {
        setIsIncreassingAllowance(true);
        await setAllowance();
      } finally {
        setIsIncreassingAllowance(false);
      }
    } else {
      try {
        setIsProcessingSwap(true);
        const tx = await swapTokens();

        if (!tx) {
          await simulateNavigationDelay(() =>
            navigation.navigate('SwapErrorScreen', routeParams)
          );
        } else {
          await simulateNavigationDelay(() =>
            navigation.navigate('SwapSuccessScreen', {
              ...routeParams,
              txHash: tx.hash
            })
          );
        }
      } catch (error) {
        await simulateNavigationDelay(() =>
          navigation.navigate('SwapErrorScreen', routeParams)
        );
        throw error;
      }
    }
  }, [
    navigation,
    prepareRouteParams,
    setAllowance,
    setIsIncreassingAllowance,
    setIsProcessingSwap,
    simulateNavigationDelay,
    swapTokens,
    uiBottomSheetInformation.allowance
  ]);

  // UI Button Elements
  if (
    uiBottomSheetInformation?.priceImpact &&
    uiBottomSheetInformation?.priceImpact > 5
  ) {
    return (
      <SwapErrorImpactButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (uiBottomSheetInformation.allowance !== 'suitable') {
    return (
      <ApprovalRequiredButton
        isProcessingSwap={isProcessingSwap}
        isIncreasingAllowance={isIncreasingAllowance}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (uiBottomSheetInformation.allowance === 'suitable') {
    return (
      <SwapButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }
};
