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
    (middleHopAddresses: string[] = [], changeUiHopArray: boolean) => {
      if (changeUiHopArray) {
        setIsMultiHopSwapCurrencyBetter({
          state: middleHopAddresses.length > 0,
          tokens: middleHopAddresses
        });
      }
    },
    [setIsMultiHopSwapCurrencyBetter]
  );

  const bestTradeExactIn = useCallback(
    async (
      amountToSell: string,
      path: string[],
      multihops: boolean,
      changeUiHopArray: boolean
    ): Promise<BigNumber> => {
      onChangeMultiHopUiState([], changeUiHopArray);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let bestMultiHopAmount: BigNumber = BigNumber.from('0');
      let bestPath: string[] = [];
      let singleHopImpact = 0.01;
      let lowestMultiHopImpact = 0.01;
      let singleHopFailed = false;

      const bnAmountToSell = ethers.utils.parseEther(amountToSell);

      if (isETHtoWrapped(path) || isWrappedToETH(path)) {
        return (
          await getAmountsIn({ path, amountToReceive: bnAmountToSell })
        )[0];
      }

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
          )) || 0.01;
      } catch (error) {
        singleHopFailed = true;
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops && !singleHopFailed) {
        return singleHopAmount;
      }

      const possiblePaths = generateAllPossibleRoutes(
        path,
        MAX_HOPS + 1
      ).filter(
        (route) => route[0] === path[0] && route[route.length - 1] === path[1]
      );

      try {
        const pathResults = await Promise.all(
          possiblePaths.map(async (currPath) => {
            if (!singleHopFailed && currPath.length <= 2) return null;

            try {
              const [amounts] = await getAmountsIn({
                path: currPath,
                amountToReceive: bnAmountToSell
              });

              const priceImpact = await multiHopImpactGetter(currPath);

              return {
                amounts,
                path: currPath,
                priceImpact
              };
            } catch {
              return null;
            }
          })
        );

        const validResults = pathResults
          .filter(
            (result): result is NonNullable<typeof result> =>
              result !== null && result.amounts.gt(BigNumber.from('0'))
          )
          .sort((a, b) => a.priceImpact - b.priceImpact);

        if (validResults.length > 0) {
          const bestResult = validResults[0];
          bestMultiHopAmount = bestResult.amounts;
          bestPath = bestResult.path;
          lowestMultiHopImpact = bestResult.priceImpact;
        }

        if (singleHopFailed && bestMultiHopAmount.gt(BigNumber.from('0'))) {
          const middleTokens = bestPath.slice(1, -1);
          onChangeMultiHopUiState(middleTokens, changeUiHopArray);
          return bestMultiHopAmount;
        }

        if (!singleHopFailed) {
          const impactDifference = Math.abs(
            lowestMultiHopImpact - singleHopImpact
          );
          let useMultiHop = false;

          if (impactDifference > 0.3) {
            useMultiHop = lowestMultiHopImpact < singleHopImpact;
          } else {
            useMultiHop = isExactInRef.current
              ? bestMultiHopAmount.gt(singleHopAmount)
              : bestMultiHopAmount.lt(singleHopAmount);
          }

          if (
            useMultiHop &&
            bestPath.length > 2 &&
            bestMultiHopAmount.gt(BigNumber.from('0'))
          ) {
            const middleTokens = bestPath.slice(1, -1);
            onChangeMultiHopUiState(middleTokens, changeUiHopArray);
            return bestMultiHopAmount;
          }

          onChangeMultiHopUiState([], changeUiHopArray);
          return singleHopAmount;
        }

        return ethers.utils.parseEther('0');
      } catch (error) {
        console.error('Trade calculation error:', error);
        onChangeMultiHopUiState([], changeUiHopArray);
        return ethers.utils.parseEther('0');
      }
    },
    [
      isExactInRef,
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
      multihops: boolean,
      changeUiHopArray: boolean
    ): Promise<BigNumber> => {
      onChangeMultiHopUiState([], changeUiHopArray);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let bestMultiHopAmount: BigNumber = BigNumber.from('0');
      let bestPath: string[] = [];
      let singleHopImpact = 0.01;
      let lowestMultiHopImpact = 0.01;
      let singleHopFailed = false;

      if (isETHtoWrapped(path) || isWrappedToETH(path)) {
        return await amountOut(amountToSell, path);
      }

      try {
        singleHopAmount = await amountOut(amountToSell, path);
        singleHopImpact =
          (await singleHopImpactGetter(
            amountToSell,
            ethers.utils.formatEther(singleHopAmount)
          )) || 0.01;
      } catch (error) {
        singleHopFailed = true;
        if (!multihops) {
          setIsWarningToEnableMultihopActive(true);
          return ethers.utils.parseEther('0');
        }
      }

      if (!multihops && !singleHopFailed) {
        return singleHopAmount;
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
          possiblePaths.map(async (currPath) => {
            if (!singleHopFailed && currPath.length <= 2) return null;

            try {
              const amounts = await getAmountsOut({
                path: currPath,
                amountToSell: bnAmountToSell
              });

              const priceImpact = await multiHopImpactGetter(currPath);

              return {
                amounts,
                path: currPath,
                priceImpact
              };
            } catch {
              return null;
            }
          })
        );

        const validResults = pathResults
          .filter(
            (result): result is NonNullable<typeof result> =>
              result !== null &&
              result.amounts[result.amounts.length - 1].gt(BigNumber.from('0'))
          )
          .sort((a, b) => a.priceImpact - b.priceImpact);

        if (validResults.length > 0) {
          const bestResult = validResults[0];
          bestMultiHopAmount =
            bestResult.amounts[bestResult.amounts.length - 1];
          bestPath = bestResult.path;
          lowestMultiHopImpact = bestResult.priceImpact;
        }

        if (singleHopFailed && bestMultiHopAmount.gt(BigNumber.from('0'))) {
          const middleTokens = bestPath.slice(1, -1);
          if (changeUiHopArray)
            onChangeMultiHopUiState(middleTokens, changeUiHopArray);
          return bestMultiHopAmount;
        }

        if (!singleHopFailed) {
          const impactDifference = Math.abs(
            lowestMultiHopImpact - singleHopImpact
          );
          let useMultiHop = false;

          if (impactDifference > 0.3) {
            useMultiHop = lowestMultiHopImpact < singleHopImpact;
          } else {
            useMultiHop = isExactInRef.current
              ? bestMultiHopAmount.gt(singleHopAmount)
              : bestMultiHopAmount.lt(singleHopAmount);
          }

          if (
            useMultiHop &&
            bestPath.length > 2 &&
            bestMultiHopAmount.gt(BigNumber.from('0'))
          ) {
            const middleTokens = bestPath.slice(1, -1);
            onChangeMultiHopUiState(middleTokens, changeUiHopArray);
            return bestMultiHopAmount;
          }

          onChangeMultiHopUiState([], changeUiHopArray);
          return singleHopAmount;
        }

        return ethers.utils.parseEther('0');
      } catch (error) {
        console.error('Trade calculation error:', error);
        onChangeMultiHopUiState([], changeUiHopArray);
        return ethers.utils.parseEther('0');
      }
    },
    [
      amountOut,
      isExactInRef,
      multiHopImpactGetter,
      onChangeMultiHopUiState,
      setIsWarningToEnableMultihopActive,
      singleHopImpactGetter
    ]
  );

  const bestTradeCurrency = useCallback(
    async (amountToSell: string, path: string[], changeUiHopArray = false) => {
      setIsWarningToEnableMultihopActive(false);
      resetMultiHopUiState();

      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const { multihops } = settings.current;
      const tradeIn = isExactInRef.current;

      return tradeIn
        ? bestTradeExactOut(amountToSell, path, multihops, changeUiHopArray)
        : bestTradeExactIn(amountToSell, path, multihops, changeUiHopArray);
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
