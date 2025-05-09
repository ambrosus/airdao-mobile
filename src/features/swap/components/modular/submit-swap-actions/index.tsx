import { useCallback, useMemo } from 'react';
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
    uiBottomSheetInformation: { priceImpact, allowance },
    setIsProcessingSwap,
    isProcessingSwap,
    isIncreasingAllowance,
    setIsIncreasingAllowance,
    setEstimatedGasValues,
    isInsufficientBalance
  } = useSwapContextSelector();

  const { setAllowance, swapCallback } = useSwapActions();
  const { onChangeBottomSheetSwapStatus } = useSwapBottomSheetHandler();
  const { estimatedSwapGas, isEnoughBalanceToCoverGas } = useEstimatedGas();

  const onCompleteMultiStepSwap = useCallback(async () => {
    if (allowance === AllowanceStatus.INCREASE) {
      try {
        setIsIncreasingAllowance(true);
        await setAllowance();

        const estimatedGas = await estimatedSwapGas();

        setEstimatedGasValues({
          swap: estimatedGas,
          approval: bnZERO
        });

        await isEnoughBalanceToCoverGas(estimatedGas);
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
    allowance,
    estimatedSwapGas,
    isEnoughBalanceToCoverGas,
    onChangeBottomSheetSwapStatus,
    setAllowance,
    setEstimatedGasValues,
    setIsIncreasingAllowance,
    setIsProcessingSwap,
    swapCallback
  ]);

  const hasApprovalRequired = useMemo(() => {
    return !isInsufficientBalance && allowance !== AllowanceStatus.SUITABLE;
  }, [allowance, isInsufficientBalance]);

  // UI Button Elements
  if (!hasApprovalRequired && priceImpact && priceImpact > 5) {
    return (
      <SwapErrorImpactButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (hasApprovalRequired) {
    return (
      <ApprovalRequiredButton
        isProcessingSwap={isProcessingSwap}
        isIncreasingAllowance={isIncreasingAllowance}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }

  if (isInsufficientBalance || allowance === AllowanceStatus.SUITABLE) {
    return (
      <SwapButton
        isProcessingSwap={isProcessingSwap}
        onCompleteMultiStepSwap={onCompleteMultiStepSwap}
      />
    );
  }
};
