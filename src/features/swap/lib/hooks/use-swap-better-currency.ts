import { useCallback } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import {
  MAX_HOPS,
  dexValidators,
  generateAllPossibleRoutes,
  isETHtoWrapped,
  isWrappedToETH
} from '@features/swap/utils';
import { getAmountsOut, getAmountsIn } from '../contracts';
import { useSwapPriceImpact } from './use-swap-price-impact';
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
  const { singleHopImpactGetter, multiHopImpactGetter } = useSwapPriceImpact();

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
    (middleHopAddresses: string[] = []) => {
      setIsMultiHopSwapCurrencyBetter({
        state: middleHopAddresses.length > 0,
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
      // Clear middle tokens at the start
      onChangeMultiHopUiState([]);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let bestMultiHopAmount: BigNumber = BigNumber.from('0');
      let bestPath: string[] = [];
      let singleHopImpact = Infinity;
      let lowestMultiHopImpact = Infinity;

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
        singleHopImpact =
          (await singleHopImpactGetter(
            ethers.utils.formatEther(amounts),
            amountToSell
          )) || Infinity;
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops) {
        return singleHopAmount || ethers.utils.parseEther('0');
      }

      const possiblePaths = generateAllPossibleRoutes(
        path,
        MAX_HOPS + 1
      ).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        // Parallelize all getAmountsIn calls
        const pathResults = await Promise.all(
          possiblePaths.map(async (currentPath) => {
            // Skip calculation for direct path (single hop)
            if (currentPath.length <= 2) return null;

            try {
              const [amounts] = await getAmountsIn({
                path: currentPath,
                amountToReceive: bnAmountToSell
              });

              const priceImpact = await multiHopImpactGetter(currentPath);

              return {
                amounts,
                path: currentPath,
                priceImpact: priceImpact || Infinity
              };
            } catch {
              return null;
            }
          })
        );

        // Sort paths by price impact
        const validResults = pathResults
          .filter(
            (result): result is NonNullable<typeof result> =>
              result !== null && result.amounts.gt(BigNumber.from('0'))
          )
          .sort((a, b) => a.priceImpact - b.priceImpact);

        // Find best multi-hop path
        for (const result of validResults) {
          const amount = result.amounts;

          if (result.priceImpact < lowestMultiHopImpact) {
            bestMultiHopAmount = amount;
            bestPath = result.path;
            lowestMultiHopImpact = result.priceImpact;
          }
        }

        // Compare single hop with multi-hop
        const isMultiHopBetter =
          bestPath.length > 2 && // Must have at least one middle token
          bestMultiHopAmount.gt(BigNumber.from('0')) &&
          lowestMultiHopImpact < singleHopImpact;

        if (isMultiHopBetter) {
          const middleTokens = bestPath.slice(1, -1);

          onChangeMultiHopUiState(middleTokens);
          return bestMultiHopAmount;
        }

        onChangeMultiHopUiState([]);
        return singleHopAmount;
      } catch (error) {
        invariant(error, 'EXECUTE PRICE');
        onChangeMultiHopUiState([]);
        return singleHopAmount || ethers.utils.parseEther('0');
      }
    },
    [
      multiHopImpactGetter,
      onChangeMultiHopUiState,
      setIsWarningToEnableMultihopActive,
      singleHopImpactGetter
    ]
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
      let singleHopImpact = Infinity;
      let lowestMultiHopImpact = Infinity;

      if (isETHtoWrapped(path) || isWrappedToETH(path)) {
        return await amountOut(amountToSell, path);
      }

      try {
        singleHopAmount = await amountOut(amountToSell, path);
        singleHopImpact =
          (await singleHopImpactGetter(
            amountToSell,
            ethers.utils.formatEther(singleHopAmount)
          )) || Infinity;
      } catch (error) {
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops) {
        return singleHopAmount || ethers.utils.parseEther('0');
      }

      const possiblePaths = generateAllPossibleRoutes(
        path,
        MAX_HOPS + 1
      ).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        const bnAmountToSell = ethers.utils.parseEther(amountToSell);

        const pathResults = await Promise.all(
          possiblePaths.map(async (currentPath) => {
            if (currentPath.length <= 2) return null;

            try {
              const amounts = await getAmountsOut({
                path: currentPath,
                amountToSell: bnAmountToSell
              });

              const priceImpact = await multiHopImpactGetter(currentPath);

              return {
                amounts,
                path: currentPath,
                priceImpact: priceImpact || Infinity
              };
            } catch {
              return null;
            }
          })
        );

        // Sort paths by price impact
        const validResults = pathResults
          .filter(
            (result): result is NonNullable<typeof result> =>
              result !== null &&
              result.amounts[result.amounts.length - 1].gt(BigNumber.from('0'))
          )
          .sort((a, b) => a.priceImpact - b.priceImpact);

        for (const result of validResults) {
          const amount = result.amounts[result.amounts.length - 1];

          if (result.priceImpact < lowestMultiHopImpact) {
            bestMultiHopAmount = amount;
            bestPath = result.path;
            lowestMultiHopImpact = result.priceImpact;
          }
        }

        // Compare single hop with multi-hop
        const isMultiHopBetter =
          bestPath.length > 2 &&
          bestMultiHopAmount.gt(BigNumber.from('0')) &&
          lowestMultiHopImpact < singleHopImpact;

        if (isMultiHopBetter) {
          const middleTokens = bestPath.slice(1, -1);

          onChangeMultiHopUiState(middleTokens);
          return bestMultiHopAmount;
        }

        return singleHopAmount;
      } catch (error) {
        invariant(error, 'EXECUTE PRICE');
        onChangeMultiHopUiState([]);
        return singleHopAmount || ethers.utils.parseEther('0');
      }
    },
    [
      amountOut,
      multiHopImpactGetter,
      onChangeMultiHopUiState,
      setIsWarningToEnableMultihopActive,
      singleHopImpactGetter
    ]
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
