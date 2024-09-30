import { useCallback } from 'react';
import {
  addresses,
  isMultiHopSwapAvailable,
  extractArrayOfMiddleMultiHopAddresses,
  dexValidators
} from '@features/swap/utils';
import { getObjectKeyByValue } from '@utils/object';
import { ethers, BigNumber } from 'ethers';
import { getAmountsOut, getAmountsIn } from '../contracts';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapSettings } from './use-swap-settings';

export function useSwapBetterCurrency() {
  const {
    setIsMultiHopSwapCurrencyBetter,
    setIsWarningToEnableMultihopActive,
    isExactInRef
  } = useSwapContextSelector();
  const { settings } = useSwapSettings();

  const getTokenAmountOut = useCallback(
    async (amountToSell: string, path: string[]) => {
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);
      const prices = await getAmountsOut({
        path,
        amountToSell: bnAmountToSell
      });

      return prices[prices.length - 1] ?? [];
    },
    []
  );

  const getTokenAmountIn = useCallback(
    async (amountToReceive: string, path: string[]) => {
      const bnAmountToReceive = ethers.utils.parseEther(amountToReceive);
      const prices = await getAmountsIn({
        path,
        amountToReceive: bnAmountToReceive
      });

      return prices[0];
    },
    []
  );

  const getTokenAmountOutWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[], middleAddress: string) => {
      const [addressFrom, addressTo] = path;
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsOut({
        path: [addressFrom, middleAddress, addressTo],
        amountToSell: bnAmountToSell
      });

      return prices[prices.length - 1];
    },
    []
  );

  const getTokenAmountInWithMultiRoute = useCallback(
    async (amountToSell: string, path: string[], middleAddress: string) => {
      const [addressFrom, addressTo] = path;
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsIn({
        path: [addressFrom, middleAddress, addressTo],
        amountToReceive: bnAmountToSell
      });

      return prices[0];
    },
    []
  );

  const resetMultiHopUiState = useCallback(() => {
    return setIsMultiHopSwapCurrencyBetter({
      state: false,
      token: ''
    });
  }, [setIsMultiHopSwapCurrencyBetter]);

  const onChangeMultiHopUiState = useCallback(
    (middleHopAddress: string) => {
      setIsMultiHopSwapCurrencyBetter({
        state: true,
        token: getObjectKeyByValue(addresses, middleHopAddress) ?? ''
      });
    },
    [setIsMultiHopSwapCurrencyBetter]
  );

  const getOppositeReceivedTokenAmount = useCallback(
    async (amountToSell: string, path: string[]) => {
      setIsWarningToEnableMultihopActive(false);
      resetMultiHopUiState();
      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const { multihops } = settings.current;
      const tradeIn = isExactInRef.current;

      const isMultiHopRouteSupported = isMultiHopSwapAvailable(path);
      const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        if (tradeIn) {
          singleHopAmount = await getTokenAmountOut(amountToSell, path);
        } else {
          singleHopAmount = await getTokenAmountIn(amountToSell, path);
        }
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
        }
        console.error('Error fetching single-hop amount:', error);
      }

      if (!isMultiHopRouteSupported || !multihops) {
        return singleHopAmount;
      }

      // Calculate multi-hop amount
      try {
        if (tradeIn) {
          multiHopAmount = await getTokenAmountOutWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        } else {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        }
      } catch (error) {
        resetMultiHopUiState();
        if (tradeIn) {
          return await getTokenAmountOut(amountToSell, path);
        } else {
          return await getTokenAmountIn(amountToSell, path);
        }
      }

      if (tradeIn) {
        if (multiHopAmount.gt(singleHopAmount)) {
          onChangeMultiHopUiState(middleHopAddress.address);
        } else {
          resetMultiHopUiState();
        }
        return singleHopAmount.gt(multiHopAmount)
          ? singleHopAmount
          : multiHopAmount;
      } else {
        if (multiHopAmount.lt(singleHopAmount)) {
          onChangeMultiHopUiState(middleHopAddress.address);
        } else {
          resetMultiHopUiState();
        }
        return singleHopAmount.lt(multiHopAmount)
          ? singleHopAmount
          : multiHopAmount;
      }
    },
    [
      getTokenAmountIn,
      getTokenAmountInWithMultiRoute,
      getTokenAmountOut,
      getTokenAmountOutWithMultiRoute,
      isExactInRef,
      onChangeMultiHopUiState,
      resetMultiHopUiState,
      setIsWarningToEnableMultihopActive,
      settings
    ]
  );

  const getOppositeReceivedTokenAmountForPlate = useCallback(
    async (amountToSell: string, path: string[]) => {
      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const tradeIn = isExactInRef.current;
      const { multihops } = settings.current;

      const isMultiHopRouteSupported = isMultiHopSwapAvailable(path);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        singleHopAmount = await getTokenAmountIn(amountToSell, path);
      } catch (error) {
        console.error('Error fetching single-hop amount:', error);
      }

      if (!isMultiHopRouteSupported || !multihops) {
        return singleHopAmount;
      }

      // Calculate multi-hop amount
      try {
        const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);
        if (tradeIn) {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        } else {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        }
      } catch (error) {
        return await getTokenAmountIn(amountToSell, path);
      }

      return singleHopAmount.lt(multiHopAmount)
        ? singleHopAmount
        : multiHopAmount;
    },
    [getTokenAmountIn, getTokenAmountInWithMultiRoute, isExactInRef, settings]
  );

  return {
    getOppositeReceivedTokenAmount,
    getOppositeReceivedTokenAmountForPlate,
    getTokenAmountIn,
    getTokenAmountOut
  };
}
