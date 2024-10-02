import { useCallback } from 'react';
import {
  addresses,
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

  const bestTradeExactIn = useCallback(
    async (
      amountToSell: string,
      path: string[],
      multihops: boolean,
      middleHopAddress: string
    ): Promise<BigNumber> => {
      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        singleHopAmount = await getTokenAmountIn(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
        singleHopAmount = null as never;
        console.error('Error fetching single-hop amount:', error);
      }

      if (!multihops) return singleHopAmount;

      try {
        multiHopAmount = await getTokenAmountInWithMultiRoute(
          amountToSell,
          path,
          middleHopAddress
        );
      } catch (error) {
        console.error('Error fetching multi-hop amount:', error);
        return singleHopAmount;
      }

      if (!singleHopAmount || multiHopAmount.gt(singleHopAmount)) {
        onChangeMultiHopUiState(middleHopAddress);
        return multiHopAmount;
      }

      return singleHopAmount;
    },
    [
      getTokenAmountIn,
      getTokenAmountInWithMultiRoute,
      onChangeMultiHopUiState,
      setIsWarningToEnableMultihopActive
    ]
  );

  const bestTradeExactOut = useCallback(
    async (
      amountToSell: string,
      path: string[],
      multihops: boolean,
      middleHopAddress: string
    ): Promise<BigNumber> => {
      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        singleHopAmount = await getTokenAmountOut(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }

        singleHopAmount = null as never;
        console.error('Error fetching single-hop amount:', error);
      }

      if (!multihops) return singleHopAmount;

      try {
        multiHopAmount = await getTokenAmountOutWithMultiRoute(
          amountToSell,
          path,
          middleHopAddress
        );
      } catch (error) {
        console.error('Error fetching multi-hop amount:', error);
        return singleHopAmount;
      }

      if (!singleHopAmount || multiHopAmount.lt(singleHopAmount)) {
        onChangeMultiHopUiState(middleHopAddress);
        return multiHopAmount;
      }

      return singleHopAmount;
    },
    [
      getTokenAmountOut,
      getTokenAmountOutWithMultiRoute,
      onChangeMultiHopUiState,
      setIsWarningToEnableMultihopActive
    ]
  );

  const bestTradeCurrency = useCallback(
    async (amountToSell: string, path: string[]) => {
      setIsWarningToEnableMultihopActive(false);
      resetMultiHopUiState();

      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const { multihops } = settings.current;
      const tradeIn = isExactInRef.current;
      const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);

      return tradeIn
        ? bestTradeExactOut(
            amountToSell,
            path,
            multihops,
            middleHopAddress.address
          )
        : bestTradeExactIn(
            amountToSell,
            path,
            multihops,
            middleHopAddress.address
          );
    },
    [
      bestTradeExactIn,
      bestTradeExactOut,
      isExactInRef,
      resetMultiHopUiState,
      setIsWarningToEnableMultihopActive,
      settings
    ]
  );

  return {
    bestTradeCurrency,
    getTokenAmountOutWithMultiRoute,
    getTokenAmountIn,
    getTokenAmountOut,
    getTokenAmountInWithMultiRoute
  };
}
