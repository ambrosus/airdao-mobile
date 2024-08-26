import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapPriceImpact } from './use-swap-price-impact';
import {
  SwapStringUtils,
  isETHtoWrapped,
  isWrappedToETH,
  maximumAmountOut,
  minimumAmountOut,
  realizedLPFee
} from '@features/swap/utils';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapActions } from './use-swap-actions';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';

export function useSwapInterface() {
  const { setUiBottomSheetInformation, _refExactGetter } =
    useSwapContextSelector();

  const { onReviewSwapPreview, onReviewSwapDismiss } =
    useSwapBottomSheetHandler();

  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance } = useSwapActions();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const { hasWrapNativeToken, isEmptyAmount } = useSwapHelpers();

  const resolveBottomSheetData = useCallback(async () => {
    Keyboard.dismiss();
    if (hasWrapNativeToken) {
      onReviewSwapPreview();
      setUiBottomSheetInformation((prevState) => ({
        ...prevState,
        allowance: 'suitable'
      }));
    }

    try {
      const priceImpact = await uiPriceImpactGetter();
      const bnMinimumReceivedAmount = minimumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const bnMaximumReceivedAmount = maximumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const liquidityProviderFee = realizedLPFee(tokenToSell.AMOUNT);
      const allowance = await checkAllowance();

      if (
        typeof priceImpact === 'number' &&
        typeof liquidityProviderFee === 'number' &&
        bnMinimumReceivedAmount &&
        bnMaximumReceivedAmount
      ) {
        // Amount that could be received as minimum or maximum value
        const receivedAmountOut = SwapStringUtils.transformMinAmountValue(
          bnMinimumReceivedAmount
        );

        const receivedMaxAmountOut = SwapStringUtils.transformMinAmountValue(
          bnMaximumReceivedAmount
        );

        const minimumReceivedAmount = !_refExactGetter
          ? receivedMaxAmountOut
          : receivedAmountOut;

        setUiBottomSheetInformation({
          priceImpact,
          minimumReceivedAmount,
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
    onReviewSwapPreview,
    setUiBottomSheetInformation,
    uiPriceImpactGetter,
    settings,
    tokenToReceive.AMOUNT,
    tokenToSell.AMOUNT,
    checkAllowance,
    onReviewSwapDismiss,
    _refExactGetter
  ]);

  const isEstimatedToken = useMemo(() => {
    const isSomeTokenNotSelected = !tokenToSell.TOKEN || !tokenToReceive.TOKEN;
    const isSomeBalanceIsEmpty =
      isEmptyAmount(tokenToSell.AMOUNT) || isEmptyAmount(tokenToReceive.AMOUNT);

    const ethSwapOrUnswapPath = [
      tokenToSell.TOKEN?.address ?? '',
      tokenToReceive.TOKEN?.address ?? ''
    ];

    const isWrapEth = isWrappedToETH(ethSwapOrUnswapPath);
    const isEthUnwrap = isETHtoWrapped(ethSwapOrUnswapPath);
    const combinedSwapOrUnwrapETH = isWrapEth || isEthUnwrap;

    if (
      isSomeBalanceIsEmpty ||
      isSomeTokenNotSelected ||
      combinedSwapOrUnwrapETH
    ) {
      return {
        tokenA: false,
        tokenB: false
      };
    }

    return {
      tokenA: !_refExactGetter,
      tokenB: _refExactGetter
    };
  }, [
    _refExactGetter,
    isEmptyAmount,
    tokenToReceive.AMOUNT,
    tokenToReceive.TOKEN,
    tokenToSell.AMOUNT,
    tokenToSell.TOKEN
  ]);

  return { resolveBottomSheetData, isEstimatedToken };
}
