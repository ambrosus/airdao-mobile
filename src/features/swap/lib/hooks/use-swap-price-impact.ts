import {
  isMultiRouteWithUSDCFirst,
  isMultiRouteWithBONDFirst,
  multiRouteAddresses,
  subtractRealizedLPFeeFromInput,
  multiHopCumulativeImpact,
  singleHopImpact
} from '@features/swap/utils';

import { ethers } from 'ethers';
import { useCallback } from 'react';
import { getAmountsOut } from '../contracts';
import { useSwapContextSelector } from '@features/swap/context';
import { useAllLiquidityPools } from './use-all-liquidity-pools';
import {
  NonNullableSelectedTokensState,
  SwapToken
} from '@features/swap/types';
import { formatEther } from 'ethers/lib/utils';
import { useSwapActions } from './use-swap-actions';

export function useSwapPriceImpact() {
  const { latestSelectedTokens, latestSelectedTokensAmount, isExactInRef } =
    useSwapContextSelector();
  const { getPairAddress, getReserves } = useAllLiquidityPools();
  const { hasWrapNativeToken } = useSwapActions();

  const singleHopImpactGetter = useCallback(async () => {
    if (!hasWrapNativeToken) {
      const selectedTokens = latestSelectedTokens.current;
      const pool = getPairAddress(selectedTokens);

      if (pool && pool.pairAddress) {
        const { reserveIn, reserveOut } = await getReserves(
          pool.pairAddress,
          selectedTokens
        );

        const { TOKEN_A, TOKEN_B } = latestSelectedTokensAmount.current;
        if (reserveIn && reserveOut) {
          const amountToSell = isExactInRef.current ? TOKEN_A : TOKEN_B;
          const amountToReceive = isExactInRef.current ? TOKEN_B : TOKEN_A;

          const amountToSellWithRealizedFee =
            subtractRealizedLPFeeFromInput(amountToSell);

          const bnAmountOut = ethers.utils.parseUnits(amountToReceive);

          const impact = singleHopImpact(
            amountToSellWithRealizedFee,
            bnAmountOut,
            reserveIn,
            reserveOut
          );

          return +impact >= 0 ? impact : -impact;
        }
      }
    }
  }, [
    getPairAddress,
    getReserves,
    hasWrapNativeToken,
    isExactInRef,
    latestSelectedTokens,
    latestSelectedTokensAmount
  ]);

  const multiHopImpactGetter = useCallback(async () => {
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } =
      latestSelectedTokensAmount.current;

    const { TOKEN_A, TOKEN_B } =
      latestSelectedTokens.current as NonNullableSelectedTokensState;

    const amountToSell = isExactInRef.current ? AMOUNT_A : AMOUNT_B;

    const tokenAddresses = [TOKEN_A?.address, TOKEN_B?.address].join();

    const isMultiRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(tokenAddresses);
    const isMultiRouteBONDSwap = isMultiRouteWithBONDFirst.has(tokenAddresses);

    const calculateImpact = async (
      intermediateToken: SwapToken,
      finalTokens: [SwapToken, SwapToken],
      amountToSell: string
    ) => {
      const amountToSellWithRealizedFee =
        subtractRealizedLPFeeFromInput(amountToSell);

      const intermediatePool = getPairAddress({
        TOKEN_A,
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
              TOKEN_A,
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
            const bnAmountToSell = ethers.utils.parseUnits(
              amountToSellWithRealizedFee
            );

            const intermediatePath = [
              TOKEN_A?.address,
              intermediateToken.address
            ];
            const finalPath = [
              intermediateToken.address,
              finalTokens[1].address
            ];

            const intermediateAmount = await getAmountsOut({
              path: intermediatePath as [string, string],
              amountToSell: bnAmountToSell
            });

            const intermediateAmountToSellWithRealizedFee =
              subtractRealizedLPFeeFromInput(
                formatEther(intermediateAmount._hex)
              );

            const intermediateImpact = singleHopImpact(
              amountToSellWithRealizedFee,
              intermediateAmount,
              interReserveIn,
              interReserveOut
            );

            const finalAmount = await getAmountsOut({
              path: finalPath as [string, string],
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
        return await calculateImpact(
          { name: 'SAMB', address: multiRouteAddresses.SAMB, symbol: 'SAMB' },
          [
            { name: 'SAMB', address: multiRouteAddresses.SAMB, symbol: 'SAMB' },
            TOKEN_B
          ],
          amountToSell
        );
      } else if (!isExactInRef.current && isMultiRouteBONDSwap) {
        return await calculateImpact(
          { name: 'SAMB', address: multiRouteAddresses.SAMB, symbol: 'SAMB' },
          [
            { name: 'BOND', address: multiRouteAddresses.BOND, symbol: 'BOND' },
            { name: 'USDC', address: multiRouteAddresses.USDC, symbol: 'USDC' }
          ],
          amountToSell
        );
      }

      return 0.0;
    } catch (error) {
      console.error('Error calculating price impact:', error);
      return 0;
    }
  }, [
    getPairAddress,
    getReserves,
    isExactInRef,
    latestSelectedTokens,
    latestSelectedTokensAmount
  ]);

  const uiPriceImpactGetter = useCallback(async () => {
    const { TOKEN_A, TOKEN_B } = latestSelectedTokens.current;
    const isExactIn = isExactInRef.current;

    const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
      [TOKEN_A?.address, TOKEN_B?.address].join()
    );

    const isMuliRouteBONDSwap = isMultiRouteWithBONDFirst.has(
      [TOKEN_A?.address, TOKEN_B?.address].join()
    );

    if (isExactIn && isMuliRouteUSDCSwap) {
      return await multiHopImpactGetter();
    } else if (!isExactIn && isMuliRouteBONDSwap) {
      return await singleHopImpactGetter();
    } else {
      return await singleHopImpactGetter();
    }
  }, [
    isExactInRef,
    latestSelectedTokens,
    multiHopImpactGetter,
    singleHopImpactGetter
  ]);

  return {
    multiHopImpactGetter,
    singleHopImpact,
    uiPriceImpactGetter
  };
}
