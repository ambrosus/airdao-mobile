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
    _refExactGetter,
    uiBottomSheetInformation,
    setUiBottomSheetInformation,
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
    async ({ estimateGas = false }: { estimateGas?: boolean }) => {
      const signer = createSigner(await _extractPrivateKey());
      const { slippageTolerance, deadline, multihops } = settings.current;
      const _slippage = +slippageTolerance;

      // Handle ETH wrapping/unwrapping
      if (isETHtoWrapped(tokensRoute)) {
        return await wrapETH(tokenToSell.AMOUNT, signer);
      }
      if (isWrappedToETH(tokensRoute)) {
        return await unwrapETH(tokenToSell.AMOUNT, signer);
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
          tokenToSell.AMOUNT,
          tokenToReceive.AMOUNT,
          path,
          signer,
          _slippage,
          deadline,
          _refExactGetter,
          estimateGas
        );
      }

      // Handle direct routes
      if (isStartsWithETH) {
        return await swapExactETHForTokens(
          tokenToSell.AMOUNT,
          tokenToReceive.AMOUNT,
          wrappedPathWithoutMultihops,
          signer,
          _slippage,
          deadline,
          _refExactGetter,
          estimateGas
        );
      }

      if (isEndsWithETH) {
        return await swapExactTokensForETH(
          tokenToSell.AMOUNT,
          tokenToReceive.AMOUNT,
          wrappedPathWithoutMultihops,
          signer,
          _slippage,
          deadline,
          _refExactGetter,
          estimateGas
        );
      }

      return await swapExactTokensForTokens(
        tokenToSell.AMOUNT,
        tokenToReceive.AMOUNT,
        wrappedPathWithoutMultihops,
        signer,
        _slippage,
        deadline,
        _refExactGetter,
        estimateGas
      );
    },
    [
      _extractPrivateKey,
      _refExactGetter,
      isEndsWithETH,
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
