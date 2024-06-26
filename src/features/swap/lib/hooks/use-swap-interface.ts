import { useCallback, useMemo } from 'react';
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
    isReversedTokens,
    _refExactGetter,
    selectedTokens,
    selectedTokensAmount
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

      const amountToSell =
        latestSelectedTokensAmount.current[
          isReversedTokens ? FIELD.TOKEN_A : tokensToSellKey
        ];

      const liquidityProviderFee = realizedLPFee(amountToSell);
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

  const isEstimatedToken = useMemo(() => {
    const emptyInputValue = '' && '0';

    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

    const isSomeBalanceIsEmpty =
      AMOUNT_A === emptyInputValue || AMOUNT_B === emptyInputValue;

    if (isSomeBalanceIsEmpty || isSomeTokenNotSelected) {
      return {
        tokenA: false,
        tokenB: false
      };
    }

    return {
      tokenA: !_refExactGetter,
      tokenB: _refExactGetter
    };
  }, [_refExactGetter, selectedTokens, selectedTokensAmount]);

  return { resolveBottomSheetData, isEstimatedToken };
}
