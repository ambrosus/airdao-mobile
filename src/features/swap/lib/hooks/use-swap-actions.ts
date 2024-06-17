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
  const {
    selectedTokensAmount,
    selectedTokens,
    isExactInRef,
    isReversedMultiRouteRef
  } = useSwapContextSelector();

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

      if (
        addressFrom === multiRouteAddresses.USDC &&
        addressTo === multiRouteAddresses.BOND
      ) {
        const bnAmountToSell = ethers.utils.parseUnits(amountToSell);
        const usdcToNativeAmount = await getAmountsOut({
          path: [addressFrom, multiRouteAddresses.SAMB],
          amountToSell: bnAmountToSell
        });

        return getAmountsOut({
          path: [multiRouteAddresses.SAMB, multiRouteAddresses.BOND],
          amountToSell: usdcToNativeAmount
        });
      }
    },
    []
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: [string, string]) => {
      if (amountToSell === '' || amountToSell === '0') return;

      const [addressFrom, addressTo] = path;
      const multiRouteAddresses = MULTI_ROUTE_ADDRESSES[environment];
      if (
        isExactInRef.current &&
        addressFrom === multiRouteAddresses.USDC &&
        addressTo === multiRouteAddresses.BOND
      ) {
        return await getTokenAmountOutWithMultiRoute(amountToSell, path);
      } else if (
        isReversedMultiRouteRef.current &&
        addressFrom === multiRouteAddresses.BOND &&
        addressTo === multiRouteAddresses.USDC
      ) {
        return await getTokenAmountOut(amountToSell, path);
      } else {
        return await getTokenAmountOut(amountToSell, path);
      }
    },
    [
      getTokenAmountOut,
      getTokenAmountOutWithMultiRoute,
      isExactInRef,
      isReversedMultiRouteRef
    ]
  );

  return {
    checkAllowance,
    setAllowance,
    isProcessingAllowance,
    getOppositeReceivedTokenAmount
  };
}
