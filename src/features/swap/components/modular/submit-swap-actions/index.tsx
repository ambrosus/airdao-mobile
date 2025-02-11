import { useCallback } from 'react';
import { Alert } from 'react-native';
import { bnZERO } from '@constants/variables';
import {
  ApprovalRequiredButton,
  SwapButton,
  SwapErrorImpactButton
} from '@features/swap/components/base/swap-buttons-list';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useEstimatedGas,
  useSwapActions,
  useSwapBottomSheetHandler
} from '@features/swap/lib/hooks';
import { AllowanceStatus, BottomSheetStatus } from '@features/swap/types';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';

const SWAP_ERROR_TITLE = 'The transaction cannot succeed due to error:';
const SWAP_ERROR_DESCRIPTION =
  'missing revert data in call exception; Transaction reverted without a reason string. This is probably an issue with one of the tokens you are swapping.';

export const SubmitSwapActions = () => {
  const {
    uiBottomSheetInformation,
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance,
    setEstimatedGasValues
  } = useSwapContextSelector();

  const { setAllowance, swapCallback } = useSwapActions();
  const { onChangeBottomSheetSwapStatus } = useSwapBottomSheetHandler();
  const { estimatedSwapGas } = useEstimatedGas();

  const onCompleteMultiStepSwap = useCallback(async () => {
    if (uiBottomSheetInformation.allowance === AllowanceStatus.INCREASE) {
      try {
        setIsIncreasingAllowance(true);
        await setAllowance();

        const estimatedGas = await estimatedSwapGas();

        setEstimatedGasValues({
          swap: estimatedGas,
          approval: bnZERO
        });
      } finally {
        setIsIncreasingAllowance(false);
      }
    } else {
      try {
        setIsProcessingSwap(true);
        const tx = await swapCallback({ estimateGas: false });

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
    estimatedSwapGas,
    onChangeBottomSheetSwapStatus,
    setAllowance,
    setEstimatedGasValues,
    setIsIncreasingAllowance,
    setIsProcessingSwap,
    swapCallback,
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

  if (uiBottomSheetInformation.allowance !== AllowanceStatus.SUITABLE) {
    return (
      <ApprovalRequiredButton
        isProcessingSwap={isProcessingSwap}
        isIncreasingAllowance={isIncreasingAllowance}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (uiBottomSheetInformation.allowance === AllowanceStatus.SUITABLE) {
    return (
      <SwapButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }
};
