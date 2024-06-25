import React, { useCallback, useState } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapActions } from '@features/swap/lib/hooks';
import {
  SwapErrorImpactButton,
  ApprovalRequiredButton,
  SwapButton
} from '../../base/swap-buttons-list';

export const SubmitSwapActions = () => {
  const { uiBottomSheetInformation } = useSwapContextSelector();

  const { setAllowance, swapTokens } = useSwapActions();

  const [isProcessingSwap, setIsProcessingSwap] = useState(false);
  const [isIncreasingAllowance, setIsIncreassingAllowance] = useState(false);

  const onCompleteMultiStepSwap = useCallback(async () => {
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
        await swapTokens();
      } finally {
        setIsProcessingSwap(false);
      }
    }
  }, [setAllowance, swapTokens, uiBottomSheetInformation.allowance]);

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
