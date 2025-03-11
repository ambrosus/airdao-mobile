import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletPrivateKey } from '@entities/wallet';
import { useSwapContextSelector } from '@features/swap/context';
import {
  calculateAllowanceWithProviderFee,
  isETHtoWrapped,
  isWrappedToETH,
  wrapNativeAddress
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import {
  checkIsApprovalRequired,
  increaseAllowance,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens,
  swapMultiHopExactTokensForTokens,
  unwrapETH,
  wrapETH
} from '../contracts';
import { useSwapHelpers } from './use-swap-helpers';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapActions() {
  const { _extractPrivateKey } = useWalletPrivateKey();

  const {
    uiBottomSheetInformation,
    setUiBottomSheetInformation,
    isExactInRef,
    isMultiHopSwapBetterCurrency
  } = useSwapContextSelector();

  const { settings } = useSwapSettings();
  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();
  const { isStartsWithETH, isEndsWithETH } = useSwapHelpers();

  const checkAllowance = useCallback(async () => {
    try {
      const privateKey = await _extractPrivateKey();

      const amountWithFee = calculateAllowanceWithProviderFee(
        tokenToSell.AMOUNT
      );

      const bnAmountToSell = ethers.utils.parseEther(amountWithFee);

      return checkIsApprovalRequired({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });
    } catch (error) {
      throw error;
    }
  }, [_extractPrivateKey, tokenToSell.AMOUNT, tokenToSell.TOKEN?.address]);

  const setAllowance = useCallback(async () => {
    try {
      const privateKey = await _extractPrivateKey();

      const amountWithFee = calculateAllowanceWithProviderFee(
        tokenToSell.AMOUNT
      );

      const bnAmountToSell = ethers.utils.parseEther(amountWithFee);

      const allowance = await increaseAllowance({
        address: tokenToSell.TOKEN?.address ?? '',
        privateKey,
        amount: bnAmountToSell
      });

      const response = await allowance.wait();

      if (response) {
        checkAllowance();
        setUiBottomSheetInformation({
          ...uiBottomSheetInformation,
          allowance: 'increased'
        });
      }
    } catch (error) {
      throw error;
    }
  }, [
    _extractPrivateKey,
    checkAllowance,
    setUiBottomSheetInformation,
    tokenToSell,
    uiBottomSheetInformation
  ]);

  const swapCallback = useCallback(
    async ({
      estimateGas = false,
      amountIn,
      amountOut,
      tradeIn
    }: {
      estimateGas?: boolean;
      amountIn?: string;
      amountOut?: string;
      tradeIn?: boolean;
    }) => {
      const signer = createSigner(await _extractPrivateKey());
      const { slippageTolerance, deadline, multihops } = settings.current;
      const _slippage = +slippageTolerance;
      const isTradeIn = tradeIn ?? isExactInRef.current;

      const _amountIn = amountIn ?? tokenToSell.AMOUNT;
      const _amountOut = amountOut ?? tokenToReceive.AMOUNT;

      // Handle ETH wrapping/unwrapping
      if (isETHtoWrapped(tokensRoute)) {
        return await wrapETH(_amountIn, signer, { estimateGas });
      }
      if (isWrappedToETH(tokensRoute)) {
        return await unwrapETH(_amountIn, signer, { estimateGas });
      }

      sendFirebaseEvent(CustomAppEvents.swap_start);

      const wrappedPathWithoutMultihops = wrapNativeAddress(tokensRoute);

      const isMultiHopSwapPossible =
        multihops && isMultiHopSwapBetterCurrency.tokens.length > 0;

      // Use the best route for the swap
      if (isMultiHopSwapPossible) {
        const path = [
          ...tokensRoute.slice(0, 1),
          ...isMultiHopSwapBetterCurrency.tokens,
          ...tokensRoute.slice(-1)
        ];

        return await swapMultiHopExactTokensForTokens(
          _amountIn,
          _amountOut,
          path,
          signer,
          _slippage,
          deadline,
          isTradeIn,
          estimateGas
        );
      }

      // Handle direct routes
      if (isStartsWithETH) {
        return await swapExactETHForTokens(
          _amountIn,
          _amountOut,
          wrappedPathWithoutMultihops,
          signer,
          _slippage,
          deadline,
          isTradeIn,
          estimateGas
        );
      }

      if (isEndsWithETH) {
        return await swapExactTokensForETH(
          _amountIn,
          _amountOut,
          wrappedPathWithoutMultihops,
          signer,
          _slippage,
          deadline,
          isTradeIn,
          estimateGas
        );
      }

      return await swapExactTokensForTokens(
        _amountIn,
        _amountOut,
        wrappedPathWithoutMultihops,
        signer,
        _slippage,
        deadline,
        isTradeIn,
        estimateGas
      );
    },
    [
      _extractPrivateKey,
      isEndsWithETH,
      isExactInRef,
      isMultiHopSwapBetterCurrency.tokens,
      isStartsWithETH,
      settings,
      tokenToReceive.AMOUNT,
      tokenToSell.AMOUNT,
      tokensRoute
    ]
  );

  return {
    checkAllowance,
    setAllowance,
    swapCallback
  };
}
