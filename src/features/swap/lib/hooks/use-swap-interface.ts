import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapPriceImpact } from './use-swap-price-impact';
import {
  SwapStringUtils,
  maximumAmountOut,
  minimumAmountOut,
  realizedLPFee
} from '@features/swap/utils';
import { FIELD } from '@features/swap/types';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapActions } from './use-swap-actions';
import { useSwapSettings } from './use-swap-settings';

export function useSwapInterface() {
  const { onReviewSwapPreview, onReviewSwapDismiss } =
    useSwapBottomSheetHandler();
  const {
    latestSelectedTokensAmount,
    isExactInRef,
    setUiBottomSheetInformation,
    isReversedTokens
  } = useSwapContextSelector();
  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance, hasWrapNativeToken } = useSwapActions();
  const { settings } = useSwapSettings();

  const resolveBottomSheetData = useCallback(async () => {
    if (hasWrapNativeToken) {
      onReviewSwapPreview();
      setUiBottomSheetInformation((prevState) => ({
        ...prevState,
        allowance: 'suitable'
      }));
    }

    const tokensToSellKey = isExactInRef.current
      ? FIELD.TOKEN_A
      : FIELD.TOKEN_B;

    const oppositeLastInputKey = isExactInRef.current
      ? FIELD.TOKEN_B
      : FIELD.TOKEN_A;

    const receivedAmountOut =
      latestSelectedTokensAmount.current[oppositeLastInputKey];

    try {
      const priceImpact = await uiPriceImpactGetter();
      const bnMinimumReceivedAmount = minimumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseUnits(receivedAmountOut)
      );

      const bnMaximumReceivedAmount = maximumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseUnits(receivedAmountOut)
      );

      const amountToSell = latestSelectedTokensAmount.current[tokensToSellKey];

      const liquidityProviderFee = realizedLPFee(
        isReversedTokens
          ? latestSelectedTokensAmount.current.TOKEN_A
          : amountToSell
      );
      const allowance = await checkAllowance();

      if (
        typeof priceImpact === 'number' &&
        typeof liquidityProviderFee === 'number' &&
        bnMinimumReceivedAmount &&
        bnMaximumReceivedAmount
      ) {
        const receivedAmountOut = SwapStringUtils.transformMinAmountValue(
          bnMinimumReceivedAmount
        );

        const receivedMaxAmountOut = SwapStringUtils.transformMinAmountValue(
          bnMaximumReceivedAmount
        );

        setUiBottomSheetInformation({
          priceImpact,
          minimumReceivedAmount: isReversedTokens
            ? receivedMaxAmountOut
            : receivedAmountOut,
          lpFee: SwapStringUtils.transformRealizedLPFee(
            String(liquidityProviderFee)
          ),
          allowance: allowance ? 'increase' : 'suitable'
        });

        setTimeout(() => {
          onReviewSwapPreview();
        }, 500);
      }
    } catch (error) {
      onReviewSwapDismiss();
      throw error;
    }
  }, [
    hasWrapNativeToken,
    isExactInRef,
    latestSelectedTokensAmount,
    onReviewSwapPreview,
    setUiBottomSheetInformation,
    uiPriceImpactGetter,
    settings,
    checkAllowance,
    isReversedTokens,
    onReviewSwapDismiss
  ]);

  return { resolveBottomSheetData };
}
