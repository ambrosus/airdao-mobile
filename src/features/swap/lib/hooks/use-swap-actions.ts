import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import {
  checkIsApprovalRequired,
  getAmountsOut,
  increaseAllowance
} from '../contracts';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import { MULTI_ROUTE_ADDRESSES } from '@features/swap/entities';
import { environment } from '@utils/environment';

export function useSwapActions() {
  const { selectedAccount } = useBridgeContextSelector();
  const { selectedTokensAmount, selectedTokens, isExactInRef } =
    useSwapContextSelector();

  const [isProcessingAllowance, setIsProcessingAllowance] = useState(false);

  const checkAllowance = useCallback(async () => {
    setIsProcessingAllowance(true);
    try {
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
      )) as string;

      const bnAmountToSell = ethers.utils.parseEther(
        selectedTokensAmount.TOKEN_A
      );

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
  }, [selectedAccount, selectedTokens.TOKEN_A, selectedTokensAmount.TOKEN_A]);

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
      const multiRouteAddresses = MULTI_ROUTE_ADDRESSES[environment];

      const isMultiRouteWithUSDCFirst = new Set([
        [multiRouteAddresses.USDC, multiRouteAddresses.BOND].join()
      ]);

      const isMultiRouteWithBONDFirst = new Set([
        [multiRouteAddresses.BOND, multiRouteAddresses.USDC].join()
      ]);

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

  return {
    checkAllowance,
    setAllowance,
    isProcessingAllowance,
    getOppositeReceivedTokenAmount
  };
}
