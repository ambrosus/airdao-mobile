import { useCallback } from 'react';
import { ethers, BigNumber } from 'ethers';
import { bnZERO } from '@constants/variables';
import { useSwapContextSelector } from '@features/swap/context';
import {
  dexValidators,
  generateAllPossibleRoutes,
  isETHtoWrapped,
  isTradeBetter,
  isWrappedToETH
} from '@features/swap/utils';
import { getAmountsOut, getAmountsIn } from '../contracts';
import { useSwapSettings } from './use-swap-settings';

function invariant(reason: unknown, key: string) {
  throw Error(`${reason} - ${key}`);
}

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
      let singleHopAmount: BigNumber = bnZERO;
      let bestMultiHopAmount: BigNumber = bnZERO;
      let bestPath: string[] = [];

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      if (isETHtoWrapped(path) || isWrappedToETH(path)) {
        return (
          await getAmountsIn({ path, amountToReceive: bnAmountToSell })
        )[0];
      }

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
          return bnZERO;
        }
      }

      if (!multihops) return singleHopAmount || bnZERO;

      // Generate possible routes with maximum 3 hops
      const possiblePaths = generateAllPossibleRoutes(path, 3).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        // Parallelize all getAmountsIn calls
        const pathResults = await Promise.all(
          possiblePaths.map(async (currentPath) => {
            try {
              const [amounts] = await getAmountsIn({
                path: currentPath,
                amountToReceive: bnAmountToSell
              });
              return { amounts, path: currentPath };
            } catch {
              return null;
            }
          })
        );

        // Find the best multi-hop route
        for (const result of pathResults) {
          if (result && result.amounts) {
            // For exact-in trades, lower input amount is better
            if (
              bestMultiHopAmount.isZero() ||
              isTradeBetter(result.amounts, bestMultiHopAmount)
            ) {
              bestMultiHopAmount = result.amounts;
              bestPath = result.path;
            }
          }
        }

        // Compare single-hop vs multi-hop
        if (bestPath.length > 0) {
          // For exact-in trades, lower input amount is better
          if (isTradeBetter(bestMultiHopAmount, singleHopAmount)) {
            const middleTokens = bestPath.slice(1, -1);
            onChangeMultiHopUiState(middleTokens);
            return bestMultiHopAmount;
          }
        }

        // Return single-hop if it exists and is better or equal
        if (!singleHopAmount.isZero()) {
          onChangeMultiHopUiState([]);
          return singleHopAmount;
        }

        // If multi-hop exists but single-hop doesn't
        if (!bestMultiHopAmount.isZero()) {
          const middleTokens = bestPath.slice(1, -1);
          onChangeMultiHopUiState(middleTokens);
          return bestMultiHopAmount;
        }

        // If no valid routes found
        return bnZERO;
      } catch (error) {
        invariant(error, 'bestTradeExactIn route check failed:');
        if (!singleHopAmount.isZero()) {
          return singleHopAmount;
        }
        return bnZERO;
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
      let singleHopAmount: BigNumber = bnZERO;
      let bestMultiHopAmount: BigNumber = bnZERO;
      let bestPath: string[] = [];

      if (isETHtoWrapped(path) || isWrappedToETH(path)) {
        return await amountOut(amountToSell, path);
      }

      // Try single hop first
      try {
        singleHopAmount = await amountOut(amountToSell, path);
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return bnZERO;
        }
      }

      if (!multihops) return singleHopAmount || bnZERO;

      // Generate possible routes with maximum 3 hops (2 intermediate tokens)
      const possiblePaths = generateAllPossibleRoutes(path, 3).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        const bnAmountToSell = ethers.utils.parseEther(amountToSell);

        // Parallelize all getAmountsOut calls
        const pathResults = await Promise.all(
          possiblePaths.map(async (currentPath) => {
            try {
              const amounts = await getAmountsOut({
                path: currentPath,
                amountToSell: bnAmountToSell
              });

              return { amounts, path: currentPath };
            } catch {
              return null;
            }
          })
        );

        // Find the best multi-hop route
        for (const result of pathResults) {
          if (result) {
            const amount = result.amounts[result.amounts.length - 1];
            if (
              amount &&
              (bestMultiHopAmount.isZero() ||
                isTradeBetter(bestMultiHopAmount, amount))
            ) {
              bestMultiHopAmount = amount;
              bestPath = result.path;
            }
          }
        }

        // Compare single-hop vs multi-hop
        if (
          bestPath.length > 0 &&
          isTradeBetter(singleHopAmount, bestMultiHopAmount)
        ) {
          const middleTokens = bestPath.slice(1, -1);
          if (middleTokens.length > 0) {
            onChangeMultiHopUiState(middleTokens);
            return bestMultiHopAmount;
          }
        }

        // Return single-hop if multi-hop isn't significantly better
        onChangeMultiHopUiState([]);
        return singleHopAmount || bnZERO;
      } catch (error) {
        invariant(error, 'bestTradeExactOut route check failed:');
        return singleHopAmount || bnZERO;
      }
    },
    [amountOut, onChangeMultiHopUiState, setIsWarningToEnableMultihopActive]
  );

  const bestTradeCurrency = useCallback(
    async (amountToSell: string, path: string[]) => {
      setIsWarningToEnableMultihopActive(false);
      resetMultiHopUiState();

      if (dexValidators.isEmptyAmount(amountToSell)) return bnZERO;

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
