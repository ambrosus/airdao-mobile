import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
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
import {
  wrapNativeAddress,
  isETHtoWrapped,
  isWrappedToETH,
  isMultiHopSwapAvailable,
  calculateAllowanceWithProviderFee
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';
import { useWallet } from '@hooks';

export function useSwapActions() {
  const { _extractPrivateKey } = useWallet();

  const {
    _refExactGetter,
    uiBottomSheetInformation,
    setUiBottomSheetInformation,
    isMultiHopSwapBetterCurrency
  } = useSwapContextSelector();

  const { settings } = useSwapSettings();
  const { tokensRoute, tokenToSell } = useSwapTokens();
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

  const swapTokens = useCallback(async () => {
    const signer = createSigner(await _extractPrivateKey());
    const { slippageTolerance, deadline, multihops } = settings.current;
    const excludeNativeETH = wrapNativeAddress(tokensRoute);
    const isMultiHopPathAvailable = isMultiHopSwapAvailable(excludeNativeETH);
    const tradeIn = _refExactGetter;
    const _slippage = +slippageTolerance;

    const isMultiHopSwapPossible =
      multihops &&
      isMultiHopPathAvailable &&
      isMultiHopSwapBetterCurrency.state;

    if (isETHtoWrapped(tokensRoute)) {
      return await wrapETH(tokenToSell.AMOUNT, signer);
    }

    if (isWrappedToETH(tokensRoute)) {
      return await unwrapETH(tokenToSell.AMOUNT, signer);
    }

    if (isStartsWithETH && !isMultiHopSwapPossible) {
      return await swapExactETHForTokens(
        tokenToSell.AMOUNT,
        excludeNativeETH,
        signer,
        _slippage,
        deadline,
        tradeIn
      );
    }

    if (isEndsWithETH && !isMultiHopSwapPossible) {
      return await swapExactTokensForETH(
        tokenToSell.AMOUNT,
        excludeNativeETH,
        signer,
        _slippage,
        deadline,
        tradeIn
      );
    }

    if (multihops && isMultiHopSwapPossible) {
      return await swapMultiHopExactTokensForTokens(
        tokenToSell.AMOUNT,
        tokensRoute,
        signer,
        _slippage,
        deadline,
        tradeIn
      );
    }

    return await swapExactTokensForTokens(
      tokenToSell.AMOUNT,
      excludeNativeETH,
      signer,
      _slippage,
      deadline,
      tradeIn
    );
  }, [
    _extractPrivateKey,
    _refExactGetter,
    isEndsWithETH,
    isMultiHopSwapBetterCurrency.state,
    isStartsWithETH,
    settings,
    tokenToSell.AMOUNT,
    tokensRoute
  ]);

  return {
    checkAllowance,
    setAllowance,
    swapTokens
  };
}
