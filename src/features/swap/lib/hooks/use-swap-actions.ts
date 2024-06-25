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
  swapMultiHopExactTokensForTokens
} from '../contracts';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import { MULTI_ROUTE_ADDRESSES } from '@features/swap/entities';
import { environment } from '@utils/environment';
import {
  wrapNativeAddress,
  isNativeWrapped,
  isMultiRouteWithUSDCFirst,
  isMultiRouteWithBONDFirst,
  multiRouteAddresses,
  executeSwapPath
} from '@features/swap/utils';
import { FIELD } from '@features/swap/types';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { useSwapSettings } from './use-swap-settings';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextSelector();
  const {
    selectedTokensAmount,
    selectedTokens,
    isExactInRef,
    uiBottomSheetInformation,
    setUiBottomSheetInformation
  } = useSwapContextSelector();

  const { settings } = useSwapSettings();

  const checkAllowance = useCallback(async () => {
    const isExactIn = isExactInRef.current;

    const amountToSell =
      selectedTokensAmount[isExactIn ? FIELD.TOKEN_B : FIELD.TOKEN_A];

    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      return checkIsApprovalRequired({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: selectedTokens.TOKEN_A!.address,
        privateKey,
        amount: bnAmountToSell
      });
    } catch (error) {
      throw error;
    }
  }, [
    isExactInRef,
    selectedAccount?._raw,
    selectedTokens.TOKEN_A,
    selectedTokensAmount
  ]);

  const setAllowance = useCallback(async () => {
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther('1000000');

      const allowance = await increaseAllowance({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: selectedTokens.TOKEN_A!.address,
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
    selectedTokens.TOKEN_A,
    setUiBottomSheetInformation,
    uiBottomSheetInformation
  ]);

  const getTokenAmountOut = useCallback(
    async (amountToSell: string, path: [string, string]) => {
      const bnAmountToSell = ethers.utils.parseUnits(amountToSell);
      return getAmountsOut({
        path,
        amountToSell: bnAmountToSell
      });
    },
    []
  );

  const getTokenAmountOutWithMultiRoute = useCallback(
    async (amountToSell: string, path: [string, string]) => {
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
          path: intermediatePath as [string, string],
          amountToSell: bnAmountToSell
        });

        return await getAmountsOut({
          path: finalPath as [string, string],
          amountToSell: intermediateAmount
        });
      }
    },
    [isExactInRef]
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: [string, string]) => {
      if (amountToSell === '' || amountToSell === '0') return;
      const [addressFrom, addressTo] = path;

      const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
        [addressFrom, addressTo].join()
      );

      const isMuliRouteBONDSwap = isMultiRouteWithBONDFirst.has(
        [addressFrom, addressTo].join()
      );

      if (
        settings.current.multihops &&
        isExactInRef.current &&
        isMuliRouteUSDCSwap
      ) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, path);
      } else if (
        settings.current.multihops &&
        !isExactInRef.current &&
        isMuliRouteBONDSwap
      ) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, [
          multiRouteAddresses.BOND,
          multiRouteAddresses.USDC
        ]);
      } else {
        return await getTokenAmountOut(amountToSell, path);
      }
    },
    [getTokenAmountOut, getTokenAmountOutWithMultiRoute, isExactInRef, settings]
  );

  const swapTokens = useCallback(async () => {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
    )) as string;
    const signer = createSigner(privateKey);

    const isExactIn = isExactInRef.current;
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    const tokenAddresses = [TOKEN_A?.address, TOKEN_B?.address].join();

    const isMultiRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(tokenAddresses);
    const isMultiRouteBONDSwap = isMultiRouteWithBONDFirst.has(tokenAddresses);

    const amountToSell =
      selectedTokensAmount[isExactIn ? FIELD.TOKEN_A : FIELD.TOKEN_B];

    const path = executeSwapPath(isExactIn, [
      TOKEN_A?.address,
      TOKEN_B?.address
    ]);

    if (path[0] === multiRouteAddresses.AMB) {
      const excludeNativeETH = wrapNativeAddress(path);
      await swapExactETHForTokens(
        amountToSell,
        excludeNativeETH,
        signer,
        settings.current.slippageTolerance,
        settings.current.deadline
      );
    } else if (path[1] === multiRouteAddresses.AMB) {
      const excludeNativeETH = wrapNativeAddress(path);
      await swapExactTokensForETH(
        amountToSell,
        excludeNativeETH,
        signer,
        settings.current.slippageTolerance,
        settings.current.deadline
      ),
        settings.current.slippageTolerance;
    } else if (
      settings.current.multihops &&
      isExactInRef.current &&
      isMultiRouteUSDCSwap
    ) {
      await swapMultiHopExactTokensForTokens(
        amountToSell,
        path,
        signer,
        settings.current.slippageTolerance,
        settings.current.deadline
      );
    } else if (
      settings.current.multihops &&
      !isExactInRef.current &&
      isMultiRouteBONDSwap
    ) {
      await swapMultiHopExactTokensForTokens(
        amountToSell,
        path,
        signer,
        settings.current.slippageTolerance,
        settings.current.deadline
      );
    } else {
      await swapExactTokensForTokens(
        amountToSell,
        path,
        signer,
        settings.current.slippageTolerance,
        settings.current.deadline
      );
    }
  }, [
    isExactInRef,
    selectedAccount?._raw,
    selectedTokens,
    selectedTokensAmount,
    settings
  ]);

  const hasWrapNativeToken = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;

    if (TOKEN_A && TOKEN_B) {
      const excludeNativeETH = wrapNativeAddress([
        TOKEN_A.address,
        TOKEN_B.address
      ]);
      return isNativeWrapped(excludeNativeETH);
    }
  }, [selectedTokens]);

  return {
    checkAllowance,
    setAllowance,
    getOppositeReceivedTokenAmount,
    hasWrapNativeToken,
    swapTokens
  };
}
