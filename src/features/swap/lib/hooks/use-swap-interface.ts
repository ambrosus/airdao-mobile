import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapPriceImpact } from './use-swap-price-impact';
import {
  SwapStringUtils,
  minimumAmountOut,
  realizedLPFee
} from '@features/swap/utils';
import { FIELD } from '@features/swap/types';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapActions } from './use-swap-actions';

export function useSwapInterface() {
  const { onReviewSwapPreview } = useSwapBottomSheetHandler();

  const {
    lastChangedInput,
    slippageTolerance,
    latestSelectedTokensAmount,
    isExactInRef,
    setUiBottomSheetInformation
  } = useSwapContextSelector();
  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance } = useSwapActions();

  const resolveBottomSheetData = useCallback(async () => {
    const oppositeLastInputKey = isExactInRef.current
      ? FIELD.TOKEN_B
      : FIELD.TOKEN_A;

    const receivedAmountOut =
      latestSelectedTokensAmount.current[oppositeLastInputKey];

    try {
      const priceImpact = await uiPriceImpactGetter();
      const bnMinimumReceivedAmount = minimumAmountOut(
        `${slippageTolerance}%`,
        ethers.utils.parseUnits(receivedAmountOut)
      );

      const amountToSell = latestSelectedTokensAmount.current[lastChangedInput];
      const liquidityProviderFee = realizedLPFee(amountToSell);
      const allowance = await checkAllowance();

      if (priceImpact && bnMinimumReceivedAmount && liquidityProviderFee) {
        const receivedAmountOut = SwapStringUtils.transformMinAmountValue(
          bnMinimumReceivedAmount
        );

        setUiBottomSheetInformation({
          priceImpact,
          minimumReceivedAmount: receivedAmountOut,
          lpFee: SwapStringUtils.transformRealizedLPFee(liquidityProviderFee),
          allowance: allowance ? 'increase' : 'suitable'
        });

        setTimeout(() => {
          onReviewSwapPreview();
        }, 500);
      }
    } catch (error) {
      throw error;
    }
  }, [
    isExactInRef,
    latestSelectedTokensAmount,
    uiPriceImpactGetter,
    slippageTolerance,
    lastChangedInput,
    checkAllowance,
    setUiBottomSheetInformation,
    onReviewSwapPreview
  ]);

  return { resolveBottomSheetData };
}
