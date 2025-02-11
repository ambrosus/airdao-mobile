import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { AllowanceStatus } from '@features/swap/types';
import {
  SwapStringUtils,
  isETHtoWrapped,
  isWrappedToETH,
  maximumAmountIn,
  minimumAmountOut
} from '@features/swap/utils';
import { NumberUtils } from '@utils';
import { useSwapActions } from './use-swap-actions';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapHelpers } from './use-swap-helpers';
import { useSwapPriceImpact } from './use-swap-price-impact';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapInterface() {
  const { setUiBottomSheetInformation, _refExactGetter } =
    useSwapContextSelector();

  const { onReviewSwapPreview, onReviewSwapDismiss } =
    useSwapBottomSheetHandler();

  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance, swapCallback } = useSwapActions();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const { hasWrapNativeToken, isEmptyAmount } = useSwapHelpers();

  const resolveBottomSheetData = useCallback(async () => {
    Keyboard.dismiss();

    if (hasWrapNativeToken) {
      setUiBottomSheetInformation((prevState) => ({
        ...prevState,
        allowance: 'suitable'
      }));

      return setTimeout(() => {
        onReviewSwapPreview();
      }, 700);
    }

    try {
      const priceImpact = await uiPriceImpactGetter();
      const bnMinimumReceivedAmount = minimumAmountOut(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const bnMaximumReceivedAmount = maximumAmountIn(
        `${settings.current.slippageTolerance}%`,
        ethers.utils.parseEther(
          _refExactGetter ? tokenToReceive.AMOUNT : tokenToSell.AMOUNT
        )
      );

      const networkFee = await swapCallback({ estimateGas: true });
      const allowance = await checkAllowance();

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
        priceImpact: priceImpact ?? 0,
        minimumReceivedAmount,
        lpFee: SwapStringUtils.transformRealizedLPFee(
          NumberUtils.limitDecimalCount(ethers.utils.formatEther(networkFee), 1)
        ),
        allowance: allowance
          ? AllowanceStatus.INCREASE
          : AllowanceStatus.SUITABLE
      });

      setTimeout(() => {
        onReviewSwapPreview();
      }, 700);
    } catch (error) {
      onReviewSwapDismiss();
      throw error;
    }
  }, [
    hasWrapNativeToken,
    setUiBottomSheetInformation,
    onReviewSwapPreview,
    uiPriceImpactGetter,
    settings,
    _refExactGetter,
    tokenToReceive.AMOUNT,
    tokenToSell.AMOUNT,
    swapCallback,
    checkAllowance,
    onReviewSwapDismiss
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
