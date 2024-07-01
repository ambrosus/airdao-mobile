import { useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import {
  checkIsApprovalRequired,
  getAmountsOut,
  increaseAllowance,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens,
  swapMultiHopExactTokensForTokens,
  unwrapETH,
  wrapETH
} from '../contracts';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import { MULTI_ROUTE_ADDRESSES } from '@features/swap/entities';
import { environment } from '@utils/environment';
import {
  wrapNativeAddress,
  isNativeWrapped,
  isMultiRouteWithUSDCFirst,
  multiRouteAddresses,
  isETHtoWrapped,
  isWrappedToETH,
  executeSwapPath
} from '@features/swap/utils';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextSelector();
  const {
    isExactInRef,
    uiBottomSheetInformation,
    setUiBottomSheetInformation
  } = useSwapContextSelector();

  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive } = useSwapTokens();

  const checkAllowance = useCallback(async () => {
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

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
  }, [selectedAccount?._raw, tokenToSell.AMOUNT, tokenToSell.TOKEN?.address]);

  const setAllowance = useCallback(async () => {
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther('1000000');

      const allowance = await increaseAllowance({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    checkAllowance,
    selectedAccount?._raw,
    setUiBottomSheetInformation,
    tokenToSell.TOKEN?.address,
    uiBottomSheetInformation
  ]);

  const getTokenAmountOut = useCallback(
    async (amountToSell: string, path: string[]) => {
      const bnAmountToSell = ethers.utils.parseUnits(amountToSell);
      return getAmountsOut({
        path,
        amountToSell: bnAmountToSell
      });
    },
    []
  );

  const getTokenAmountOutWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[]) => {
      const [addressFrom, addressTo] = path;
      const multiRouteAddresses = MULTI_ROUTE_ADDRESSES[environment];

      const bnAmountToSell = ethers.utils.parseUnits(amountToSell);
      const isExactIn = isExactInRef.current;

      const isReversed =
        addressFrom === multiRouteAddresses.BOND &&
        addressTo === multiRouteAddresses.USDC;

      if (isExactIn || isReversed) {
        const intermediatePath = [addressFrom, multiRouteAddresses.SAMB];
        const finalPath = isExactIn
          ? [multiRouteAddresses.SAMB, multiRouteAddresses.BOND]
          : [multiRouteAddresses.SAMB, multiRouteAddresses.USDC];

        const intermediateAmount = await getAmountsOut({
          path: intermediatePath,
          amountToSell: bnAmountToSell
        });

        return await getAmountsOut({
          path: finalPath,
          amountToSell: intermediateAmount
        });
      }
    },
    [isExactInRef]
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: string[]) => {
      if (amountToSell === '' || amountToSell === '0') return;
      const [addressFrom, addressTo] = path;

      const route = executeSwapPath(isExactInRef.current, path);

      const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
        [addressFrom, addressTo].join()
      );

      if (settings.current.multihops && isMuliRouteUSDCSwap) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, path);
      }
      return await getTokenAmountOut(amountToSell, route);
    },
    [getTokenAmountOut, getTokenAmountOutWithMultiRoute, isExactInRef, settings]
  );

  const swapTokens = useCallback(async () => {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
    )) as string;
    const signer = createSigner(privateKey);

    const tokenAddresses = [
      tokenToSell.TOKEN?.address,
      tokenToReceive.TOKEN?.address
    ].join();

    const isMultiRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(tokenAddresses);

    const amountToSell = tokenToSell.AMOUNT;

    const path = executeSwapPath(true, [
      tokenToSell.TOKEN?.address ?? '',
      tokenToReceive.TOKEN?.address ?? ''
    ]);

    const excludeNativeETH = wrapNativeAddress(path);
    const { slippageTolerance, deadline, multihops } = settings.current;

    if (isETHtoWrapped(path)) {
      return await wrapETH(amountToSell, signer);
    }

    if (isWrappedToETH(path)) {
      return await unwrapETH(amountToSell, signer);
    }

    if (path[0] === multiRouteAddresses.AMB) {
      return await swapExactETHForTokens(
        amountToSell,
        excludeNativeETH,
        signer,
        slippageTolerance,
        deadline
      );
    }

    if (path[1] === multiRouteAddresses.AMB) {
      return await swapExactTokensForETH(
        amountToSell,
        excludeNativeETH,
        signer,
        slippageTolerance,
        deadline
      );
    }

    if (multihops && isMultiRouteUSDCSwap) {
      return await swapMultiHopExactTokensForTokens(
        amountToSell,
        path,
        signer,
        slippageTolerance,
        deadline
      );
    }

    return await swapExactTokensForTokens(
      amountToSell,
      path,
      signer,
      slippageTolerance,
      deadline
    );
  }, [
    selectedAccount?._raw,
    settings,
    tokenToReceive.TOKEN?.address,
    tokenToSell.AMOUNT,
    tokenToSell.TOKEN?.address
  ]);

  const hasWrapNativeToken = useMemo(() => {
    if (tokenToSell.TOKEN || tokenToReceive.TOKEN) {
      const excludeNativeETH = wrapNativeAddress([
        tokenToSell.TOKEN?.address ?? '',
        tokenToReceive.TOKEN?.address ?? ''
      ]);
      return isNativeWrapped(excludeNativeETH);
    }
  }, [tokenToReceive.TOKEN, tokenToSell.TOKEN]);

  return {
    checkAllowance,
    setAllowance,
    getOppositeReceivedTokenAmount,
    getTokenAmountOut,
    hasWrapNativeToken,
    swapTokens
  };
}
