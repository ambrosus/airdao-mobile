import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapActions,
  useSwapBottomSheetHandler
} from '@features/swap/lib/hooks';
import {
  ApprovalRequiredButton,
  SwapButton,
  SwapErrorImpactButton
} from '@features/swap/components/base/swap-buttons-list';
import { AllowanceStatus, BottomSheetStatus } from '@features/swap/types';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

const SWAP_ERROR_TITLE = 'The transaction cannot succeed due to error:';
const SWAP_ERROR_DESCRIPTION =
  'missing revert data in call exception; Transaction reverted without a reason string. This is probably an issue with one of the tokens you are swapping.';

export const SubmitSwapActions = () => {
  const {
    uiBottomSheetInformation,
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance
  } = useSwapContextSelector();

  const { setAllowance, swapTokens } = useSwapActions();
  const { onChangeBottomSheetSwapStatus } = useSwapBottomSheetHandler();

  const onCompleteMultiStepSwap = useCallback(async () => {
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
          onChangeBottomSheetSwapStatus(BottomSheetStatus.ERROR);
          sendFirebaseEvent(CustomAppEvents.swap_error, {
            swapError: 'swapTokens-tx not found'
          });
        } else {
          sendFirebaseEvent(CustomAppEvents.swap_finish);
          onChangeBottomSheetSwapStatus(BottomSheetStatus.SUCCESS);
        }
      } catch (error) {
        onChangeBottomSheetSwapStatus(BottomSheetStatus.ERROR);
        sendFirebaseEvent(CustomAppEvents.swap_error, {
          swapError: JSON.stringify(
            (error as { message: string })?.message ?? JSON.stringify(error)
          )
        });
        Alert.alert(SWAP_ERROR_TITLE, SWAP_ERROR_DESCRIPTION);
        throw error;
      } finally {
        setIsProcessingSwap(false);
      }
    }
  }, [
    onChangeBottomSheetSwapStatus,
    setAllowance,
    setIsIncreasingAllowance,
    setIsProcessingSwap,
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
