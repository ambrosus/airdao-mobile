import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import {
  checkIsApprovalRequired,
  getAmountsOut,
  increaseAllowance,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens
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

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextSelector();
  const { selectedTokensAmount, selectedTokens, isExactInRef } =
    useSwapContextSelector();

  const [isProcessingAllowance, setIsProcessingAllowance] = useState(false);

  const checkAllowance = useCallback(async () => {
    setIsProcessingAllowance(true);
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
    } finally {
      setIsProcessingAllowance(false);
    }
  }, [
    isExactInRef,
    selectedAccount?._raw,
    selectedTokens.TOKEN_A,
    selectedTokensAmount
  ]);

  const setAllowance = useCallback(async () => {
    setIsProcessingAllowance(true);
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(
        selectedTokensAmount.TOKEN_A
      );

      const allowance = await increaseAllowance({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        address: selectedTokens.TOKEN_A!.address,
        privateKey,
        amount: bnAmountToSell
      });

      const response = await allowance.wait();

      if (response) {
        checkAllowance();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsProcessingAllowance(false);
    }
  }, [
    checkAllowance,
    selectedAccount,
    selectedTokens.TOKEN_A,
    selectedTokensAmount.TOKEN_A
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

        const final = await getAmountsOut({
          path: finalPath as [string, string],
          amountToSell: intermediateAmount
        });

        return final;
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

      if (isExactInRef.current && isMuliRouteUSDCSwap) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, path);
      } else if (!isExactInRef.current && isMuliRouteBONDSwap) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, [
          multiRouteAddresses.BOND,
          multiRouteAddresses.USDC
        ]);
      } else {
        return await getTokenAmountOut(amountToSell, path);
      }
    },
    [getTokenAmountOut, getTokenAmountOutWithMultiRoute, isExactInRef]
  );

  const swapTokens = useCallback(async () => {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
    )) as string;

    const signer = createSigner(privateKey);

    const isExactIn = isExactInRef.current;
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const amountToSell =
      selectedTokensAmount[isExactIn ? FIELD.TOKEN_A : FIELD.TOKEN_B];

    const path = executeSwapPath(isExactIn, [
      TOKEN_A?.address,
      TOKEN_B?.address
    ]);

    if (path[0] === multiRouteAddresses.AMB) {
      const excludeNativeETH = wrapNativeAddress(path);
      await swapExactETHForTokens(amountToSell, excludeNativeETH, signer);
    } else if (path[1] === multiRouteAddresses.AMB) {
      const excludeNativeETH = wrapNativeAddress(path);
      await swapExactTokensForETH(amountToSell, excludeNativeETH, signer);
    } else {
      await swapExactTokensForTokens(
        amountToSell,
        [multiRouteAddresses.SAMB, multiRouteAddresses.USDC],
        signer
      );
    }
  }, [
    isExactInRef,
    selectedAccount?._raw,
    selectedTokens,
    selectedTokensAmount
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
    isProcessingAllowance,
    getOppositeReceivedTokenAmount,
    hasWrapNativeToken,
    swapTokens
  };
}
