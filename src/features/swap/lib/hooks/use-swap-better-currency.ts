import { useCallback } from 'react';
import {
  addresses,
  extractArrayOfMiddleMultiHopAddresses,
  dexValidators
} from '@features/swap/utils';
import { getObjectKeyByValue } from '@utils';
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

  const amountOut = useCallback(
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

  const amountIn = useCallback(
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

  const amountOutWithHop = useCallback(
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

  const amountInWithHop = useCallback(
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
        singleHopAmount = await amountIn(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
        singleHopAmount = null as never;
      }

      if (!multihops) return singleHopAmount;

      try {
        multiHopAmount = await amountInWithHop(
          amountToSell,
          path,
          extractArrayOfMiddleMultiHopAddresses(path).address
        );
      } catch (error) {
        return singleHopAmount;
      }

      if (!singleHopAmount || multiHopAmount.gt(singleHopAmount)) {
        onChangeMultiHopUiState(middleHopAddress);
        return multiHopAmount;
      }

      return singleHopAmount;
    },
    [
      amountIn,
      amountInWithHop,
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
        singleHopAmount = await amountOut(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }

        singleHopAmount = null as never;
      }

      if (!multihops) return singleHopAmount;

      try {
        multiHopAmount = await amountOutWithHop(
          amountToSell,
          path,
          extractArrayOfMiddleMultiHopAddresses(path).address
        );
      } catch (error) {
        return singleHopAmount;
      }

      if (!singleHopAmount || multiHopAmount.lt(singleHopAmount)) {
        onChangeMultiHopUiState(middleHopAddress);
        return multiHopAmount;
      }

      return singleHopAmount;
    },
    [
      amountOut,
      amountOutWithHop,
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
    amountOut,
    amountIn,
    amountOutWithHop,
    amountInWithHop
  };
}
