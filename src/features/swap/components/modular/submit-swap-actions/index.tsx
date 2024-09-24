import React, { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapActions,
  useSwapBottomSheetHandler
} from '@features/swap/lib/hooks';
import {
  SwapErrorImpactButton,
  ApprovalRequiredButton,
  SwapButton
} from '@features/swap/components/base/swap-buttons-list';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AllowanceStatus } from '@features/swap/types';

export const SubmitSwapActions = () => {
  const navigation: HomeNavigationProp = useNavigation();
  const {
    uiBottomSheetInformation,
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance,
    selectedTokens,
    selectedTokensAmount
  } = useSwapContextSelector();

  const { setAllowance, swapTokens } = useSwapActions();
  const { onReviewSwapDismiss } = useSwapBottomSheetHandler();

  const simulateNavigationDelay = useCallback(
    async (navigate: () => void) => {
      onReviewSwapDismiss();

      InteractionManager.runAfterInteractions(async () => {
        await new Promise((resolve) => setTimeout(resolve, 320));

        navigate();
        setIsProcessingSwap(false);
      });
    },
    [onReviewSwapDismiss, setIsProcessingSwap]
  );

  const prepareRouteParams = useCallback(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    const routeParams = {
      AMOUNT_A,
      AMOUNT_B: AMOUNT_B,
      SYMBOL_A: TOKEN_A?.symbol,
      SYMBOL_B: TOKEN_B?.symbol
    };

    return routeParams as any;
  }, [selectedTokens, selectedTokensAmount]);

  const onCompleteMultiStepSwap = useCallback(async () => {
    const routeParams = prepareRouteParams();
    if (uiBottomSheetInformation.allowance === AllowanceStatus.INCREASE) {
      try {
        setIsIncreasingAllowance(true);
        await setAllowance();
      } finally {
        setIsIncreasingAllowance(false);
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
              txHash: tx.transactionHash
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
    setIsIncreasingAllowance,
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
