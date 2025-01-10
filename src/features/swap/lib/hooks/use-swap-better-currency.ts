import { useCallback } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { dexValidators, generateAllPossibleRoutes } from '@features/swap/utils';
import { getAmountsOut, getAmountsIn } from '../contracts';
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
    async (amountToSell: string, fullPath: string[]): Promise<BigNumber> => {
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsOut({
        path: fullPath,
        amountToSell: bnAmountToSell
      });

      return prices[prices.length - 1];
    },
    []
  );

  const amountInWithHop = useCallback(
    async (amountToSell: string, fullPath: string[]): Promise<BigNumber> => {
      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      const prices = await getAmountsIn({
        path: fullPath,
        amountToReceive: bnAmountToSell
      });

      return prices[0];
    },
    []
  );

  const resetMultiHopUiState = useCallback(() => {
    return setIsMultiHopSwapCurrencyBetter({
      state: false,
      tokens: []
    });
  }, [setIsMultiHopSwapCurrencyBetter]);

  const onChangeMultiHopUiState = useCallback(
    (middleHopAddresses: string[]) => {
      setIsMultiHopSwapCurrencyBetter({
        state: true,
        tokens: middleHopAddresses
      });
    },
    [setIsMultiHopSwapCurrencyBetter]
  );

  const bestTradeExactIn = useCallback(
    async (
      amountToSell: string,
      path: string[],
      multihops: boolean
    ): Promise<BigNumber> => {
      let singleHopAmount: BigNumber = BigNumber.from('0');
      let bestMultiHopAmount: BigNumber = BigNumber.from('0');
      let bestPath: string[] = [];

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      // Try single hop first
      try {
        const [amounts] = await getAmountsIn({
          path,
          amountToReceive: bnAmountToSell
        });
        singleHopAmount = amounts;
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops) return singleHopAmount || ethers.utils.parseEther('0');

      const possiblePaths = generateAllPossibleRoutes(path, 3).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        for (const currentPath of possiblePaths) {
          try {
            const [amounts] = await getAmountsIn({
              path: currentPath,
              amountToReceive: bnAmountToSell
            });

            if (
              amounts &&
              (bestMultiHopAmount.isZero() || amounts.lt(bestMultiHopAmount))
            ) {
              bestMultiHopAmount = amounts;
              bestPath = currentPath;
            }
          } catch (error) {
            continue;
          }
        }

        // Handle zero amount cases
        if (singleHopAmount.isZero() && !bestMultiHopAmount.isZero()) {
          // If only multi-hop route exists
          const middleTokens = bestPath.slice(1, -1);
          onChangeMultiHopUiState(middleTokens);
          return bestMultiHopAmount;
        }

        if (!singleHopAmount.isZero() && bestMultiHopAmount.isZero()) {
          // If only single hop route exists
          onChangeMultiHopUiState([]);
          return singleHopAmount;
        }

        // If both routes exist, compare them
        if (!singleHopAmount.isZero() && !bestMultiHopAmount.isZero()) {
          const isBetterThanSingleHop = bestMultiHopAmount.lt(singleHopAmount);

          if (isBetterThanSingleHop) {
            const middleTokens = bestPath.slice(1, -1);
            onChangeMultiHopUiState(middleTokens);
            return bestMultiHopAmount;
          } else {
            onChangeMultiHopUiState([]);
            return singleHopAmount;
          }
        }

        // If no valid routes found
        return ethers.utils.parseEther('0');
      } catch (error) {
        console.error('Multi-hop route check failed:', error);
        if (!singleHopAmount.isZero()) {
          return singleHopAmount;
        }
        return ethers.utils.parseEther('0');
      }
    },
    [onChangeMultiHopUiState, setIsWarningToEnableMultihopActive]
  );

  const bestTradeExactOut = useCallback(
    async (
      amountToSell: string,
      path: string[],
      multihops: boolean
    ): Promise<BigNumber> => {
      let singleHopAmount: BigNumber = BigNumber.from('0');
      let bestMultiHopAmount: BigNumber = BigNumber.from('0');
      let bestPath: string[] = [];

      // Try single hop first
      try {
        singleHopAmount = await amountOut(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops) return singleHopAmount || ethers.utils.parseEther('0');

      const possiblePaths = generateAllPossibleRoutes(path, 4).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        const bnAmountToSell = ethers.utils.parseEther(amountToSell);

        for (const currentPath of possiblePaths) {
          try {
            const amounts = await getAmountsOut({
              path: currentPath,
              amountToSell: bnAmountToSell
            });

            const amount = amounts[amounts.length - 1];
            if (
              amount &&
              (bestMultiHopAmount.isZero() || amount.gt(bestMultiHopAmount))
            ) {
              bestMultiHopAmount = amount;
              bestPath = currentPath;
            }
          } catch {
            continue;
          }
        }

        // Compare with single hop and update state
        const isBetterThanSingleHop =
          !singleHopAmount || bestMultiHopAmount.gt(singleHopAmount);

        if (bestPath.length > 0 && isBetterThanSingleHop) {
          const middleTokens = bestPath.slice(1, -1);
          if (middleTokens.length > 0) {
            onChangeMultiHopUiState(middleTokens);
            return bestMultiHopAmount;
          }
        }
      } catch (error) {
        console.error('Multi-hop route check failed:', error);
      }

      onChangeMultiHopUiState([]);
      return singleHopAmount || ethers.utils.parseEther('0');
    },
    [amountOut, onChangeMultiHopUiState, setIsWarningToEnableMultihopActive]
  );

  const bestTradeCurrency = useCallback(
    async (amountToSell: string, path: string[]) => {
      setIsWarningToEnableMultihopActive(false);
      resetMultiHopUiState();

      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const { multihops } = settings.current;
      const tradeIn = isExactInRef.current;

      return tradeIn
        ? bestTradeExactOut(amountToSell, path, multihops)
        : bestTradeExactIn(amountToSell, path, multihops);
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
    bestTradeExactIn,
    bestTradeExactOut,
    bestTradeCurrency,
    amountOut,
    amountIn,
    amountOutWithHop,
    amountInWithHop
  };
}
