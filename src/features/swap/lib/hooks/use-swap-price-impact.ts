import { ethers } from 'ethers';
import { useCallback } from 'react';
import {
  isMultiRouteWithUSDCFirst,
  addresses,
  subtractRealizedLPFeeFromInput,
  multiHopCumulativeImpact,
  singleHopImpact
} from '@features/swap/utils';
import { getAmountsOut } from '@features/swap/lib/contracts';
import { useSwapContextSelector } from '@features/swap/context';
import { useAllLiquidityPools } from './use-all-liquidity-pools';
import { FIELD, SwapToken } from '@features/swap/types';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';
import { useSwapHelpers } from './use-swap-helpers';

export function useSwapPriceImpact() {
  const { isExactInRef } = useSwapContextSelector();
  const { getPairAddress, getReserves } = useAllLiquidityPools();
  const { hasWrapNativeToken } = useSwapHelpers();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive, tokensRoute } = useSwapTokens();

  const singleHopImpactGetter = useCallback(
    async (amountToSell: string, amountToReceive: string) => {
      if (!hasWrapNativeToken) {
        const selectedTokens = {
          [FIELD.TOKEN_A]: tokenToSell.TOKEN,
          [FIELD.TOKEN_B]: tokenToReceive.TOKEN
        };

        const pool = getPairAddress(selectedTokens);

        if (pool && pool.pairAddress) {
          const { reserveIn, reserveOut } = await getReserves(
            pool.pairAddress,
            selectedTokens
          );

          if (reserveIn && reserveOut) {
            const amountToSellWithRealizedFee =
              subtractRealizedLPFeeFromInput(amountToSell);

            const bnAmountOut = ethers.utils.parseEther(amountToReceive);

            const impact = singleHopImpact(
              amountToSellWithRealizedFee,
              bnAmountOut,
              reserveIn,
              reserveOut
            );

            return Number(+impact >= 0 ? impact : -impact);
          }
        }
      }
    },
    [
      getPairAddress,
      getReserves,
      hasWrapNativeToken,
      tokenToReceive.TOKEN,
      tokenToSell.TOKEN
    ]
  );

  const multiHopImpactGetter = useCallback(async () => {
    const tokenAddresses = tokensRoute.join();
    const isMultiRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(tokenAddresses);

    const calculateImpact = async (
      intermediateToken: SwapToken,
      finalTokens: [SwapToken, SwapToken],
      amountToSell: string
    ) => {
      const amountToSellWithRealizedFee =
        subtractRealizedLPFeeFromInput(amountToSell);

      const intermediatePool = getPairAddress({
        TOKEN_A: tokenToSell.TOKEN,
        TOKEN_B: intermediateToken
      });
      const finalPool = getPairAddress({
        TOKEN_A: intermediateToken,
        TOKEN_B: finalTokens[1]
      });

      try {
        if (intermediatePool && intermediatePool.pairAddress) {
          const { reserveIn: interReserveIn, reserveOut: interReserveOut } =
            await getReserves(intermediatePool.pairAddress, {
              TOKEN_A: tokenToSell.TOKEN,
              TOKEN_B: intermediateToken
            });

          const { reserveIn: finalReserveIn, reserveOut: finalReserveOut } =
            await getReserves(finalPool?.pairAddress ?? '', {
              TOKEN_A: intermediateToken,
              TOKEN_B: finalTokens[1]
            });

          if (
            interReserveIn &&
            interReserveOut &&
            finalReserveIn &&
            finalReserveOut
          ) {
            const bnAmountToSell = ethers.utils.parseEther(
              amountToSellWithRealizedFee
            );

            const intermediatePath = [
              tokenToSell.TOKEN?.address,
              intermediateToken.address
            ] as [string, string];

            const finalPath = [
              intermediateToken.address,
              finalTokens[1].address
            ];

            const intermediateAmount = await getAmountsOut({
              path: intermediatePath,
              amountToSell: bnAmountToSell
            });

            const intermediateAmountToSellWithRealizedFee =
              subtractRealizedLPFeeFromInput(
                ethers.utils.formatEther(intermediateAmount._hex)
              );

            const intermediateImpact = singleHopImpact(
              amountToSellWithRealizedFee,
              intermediateAmount,
              interReserveIn,
              interReserveOut
            );

            const finalAmount = await getAmountsOut({
              path: finalPath,
              amountToSell: intermediateAmount
            });

            const finalImpact = singleHopImpact(
              intermediateAmountToSellWithRealizedFee,
              finalAmount,
              finalReserveIn,
              finalReserveOut
            );

            const cumulativePriceImpact = multiHopCumulativeImpact(
              intermediateImpact,
              finalImpact
            );

            return cumulativePriceImpact;
          }
        }
      } catch (error) {
        console.error('Error calculating multi-route price impact:', error);
      }
    };

    try {
      if (isExactInRef.current && isMultiRouteUSDCSwap) {
        const _tokenToSell = tokenToSell.TOKEN as SwapToken;
        return await calculateImpact(
          { name: 'SAMB', address: addresses.SAMB, symbol: 'SAMB' },
          [
            { name: 'SAMB', address: addresses.SAMB, symbol: 'SAMB' },
            _tokenToSell
          ],
          tokenToSell.AMOUNT
        );
      }

      return 0;
    } catch (error) {
      console.error('Error calculating price impact:', error);
      return 0;
    }
  }, [getPairAddress, getReserves, isExactInRef, tokenToSell, tokensRoute]);

  const uiPriceImpactGetter = useCallback(async () => {
    const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
      tokensRoute.join()
    );

    if (settings.current.multihops && isMuliRouteUSDCSwap) {
      return await multiHopImpactGetter();
    } else {
      return await singleHopImpactGetter(
        tokenToSell.AMOUNT,
        tokenToReceive.AMOUNT
      );
    }
  }, [
    tokensRoute,
    settings,
    multiHopImpactGetter,
    singleHopImpactGetter,
    tokenToSell.AMOUNT,
    tokenToReceive.AMOUNT
  ]);

  return {
    multiHopImpactGetter,
    singleHopImpact,
    uiPriceImpactGetter
  };
}
