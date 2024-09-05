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
  isMultiHopSwapAvailable
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';
import { useWallet } from '@hooks';

export function useSwapActions() {
  const { _extractPrivateKey } = useWallet();

  const {
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
      const bnAmountToSell = ethers.utils.parseEther(tokenToSell.AMOUNT);

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
      const bnAmountToSell = ethers.utils.parseEther('100000000');

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
    tokenToSell.TOKEN?.address,
    uiBottomSheetInformation
  ]);

  const swapTokens = useCallback(async () => {
    const signer = createSigner(await _extractPrivateKey());
    const { slippageTolerance, deadline, multihops } = settings.current;
    const excludeNativeETH = wrapNativeAddress(tokensRoute);
    const isMultiHopPathAvailable = isMultiHopSwapAvailable(excludeNativeETH);

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
        slippageTolerance,
        deadline
      );
    }

    if (isEndsWithETH && !isMultiHopSwapPossible) {
      return await swapExactTokensForETH(
        tokenToSell.AMOUNT,
        excludeNativeETH,
        signer,
        slippageTolerance,
        deadline
      );
    }

    if (multihops && isMultiHopSwapPossible) {
      return await swapMultiHopExactTokensForTokens(
        tokenToSell.AMOUNT,
        tokensRoute,
        signer,
        slippageTolerance,
        deadline
      );
    }

    return await swapExactTokensForTokens(
      tokenToSell.AMOUNT,
      excludeNativeETH,
      signer,
      slippageTolerance,
      deadline
    );
  }, [
    _extractPrivateKey,
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
