import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { bnZERO } from '@constants/variables';
import { useSwapContextSelector } from '@features/swap/context';
import { INITIAL_UI_BOTTOM_SHEET_INFORMATION } from '@features/swap/context/initials';
import { AllowanceStatus } from '@features/swap/types';
import {
  SwapStringUtils,
  isETHtoWrapped,
  isWrappedToETH,
  maximumAmountIn,
  minimumAmountOut
} from '@features/swap/utils';
import { useEstimatedGas } from './use-estimated-gas';
import { useSwapActions } from './use-swap-actions';
import { useSwapBottomSheetHandler } from './use-swap-bottom-sheet-handler';
import { useSwapHelpers } from './use-swap-helpers';
import { useSwapPriceImpact } from './use-swap-price-impact';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapInterface() {
  const {
    setUiBottomSheetInformation,
    _refExactGetter,
    setEstimatedGasValues
  } = useSwapContextSelector();

  const { onReviewSwapPreview, onReviewSwapDismiss } =
    useSwapBottomSheetHandler();

  const { uiPriceImpactGetter } = useSwapPriceImpact();
  const { checkAllowance, swapCallback } = useSwapActions();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const { hasWrapNativeToken, isEmptyAmount } = useSwapHelpers();
  const { estimatedApprovalGas, isEnoughBalanceToCoverGas } = useEstimatedGas();

  const resolveBottomSheetData = useCallback(async () => {
    Keyboard.dismiss();
    setUiBottomSheetInformation(INITIAL_UI_BOTTOM_SHEET_INFORMATION);

    const networkFee = await swapCallback({ estimateGas: true });

    if (hasWrapNativeToken) {
      setEstimatedGasValues({
        swap: networkFee,
        approval: bnZERO
      });

      await isEnoughBalanceToCoverGas(networkFee);

      setUiBottomSheetInformation((prevState) => ({
        ...prevState,
        allowance: 'suitable'
      }));

      return setTimeout(() => {
        onReviewSwapPreview();
      }, 700);
    }

    try {
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

      const priceImpact = await uiPriceImpactGetter();

      const allowance = await checkAllowance();

      if (!!allowance) {
        const approvalEstimatedGas = await estimatedApprovalGas({
          amountIn: tokenToSell.AMOUNT
        });

        setEstimatedGasValues({ swap: bnZERO, approval: approvalEstimatedGas });
        await isEnoughBalanceToCoverGas(approvalEstimatedGas);
      } else {
        setEstimatedGasValues({
          swap: networkFee,
          approval: bnZERO
        });
        await isEnoughBalanceToCoverGas(networkFee);
      }

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
    settings,
    _refExactGetter,
    tokenToReceive.AMOUNT,
    tokenToSell.AMOUNT,
    uiPriceImpactGetter,
    swapCallback,
    checkAllowance,
    estimatedApprovalGas,
    setEstimatedGasValues,
    isEnoughBalanceToCoverGas,
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
