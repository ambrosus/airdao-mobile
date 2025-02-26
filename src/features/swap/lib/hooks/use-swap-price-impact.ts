import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { getAmountsOut } from '@features/swap/lib/contracts';
import { FIELD, SwapToken } from '@features/swap/types';
import {
  subtractRealizedLPFeeFromInput,
  multiHopCumulativeImpact,
  singleHopImpact,
  isMultiHopSwapAvailable,
  withMultiHopPath
} from '@features/swap/utils';
import { useAllLiquidityPools } from './use-all-liquidity-pools';
import { useSwapHelpers } from './use-swap-helpers';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

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
    if (!isMultiHopSwapAvailable(tokensRoute) || !isExactInRef.current) {
      return 0;
    }

    const path = withMultiHopPath([
      tokenToSell.TOKEN?.address ?? '',
      tokenToReceive.TOKEN?.address ?? ''
    ]);

    try {
      const amountIn = ethers.utils.parseEther(tokenToSell.AMOUNT);
      const amounts = await getAmountsOut({
        path,
        amountToSell: amountIn
      });

      // Calculate impact only for the current path
      let totalImpact = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const pairAddress = getPairAddress({
          TOKEN_A: { address: path[i] } as SwapToken,
          TOKEN_B: { address: path[i + 1] } as SwapToken
        })?.pairAddress;

        if (!pairAddress) continue;

        const { reserveIn, reserveOut } = await getReserves(pairAddress, {
          TOKEN_A: { address: path[i] } as SwapToken,
          TOKEN_B: { address: path[i + 1] } as SwapToken
        });

        if (!reserveIn || !reserveOut) continue;

        const amountInWithFee = subtractRealizedLPFeeFromInput(
          ethers.utils.formatEther(i === 0 ? amountIn : amounts[i])
        );

        const impact = singleHopImpact(
          amountInWithFee,
          amounts[i + 1],
          reserveIn,
          reserveOut
        );

        totalImpact = multiHopCumulativeImpact(totalImpact.toString(), impact);
      }

      return Math.abs(totalImpact);
    } catch (error) {
      return 0;
    }
  }, [
    getPairAddress,
    getReserves,
    isExactInRef,
    tokenToReceive.TOKEN,
    tokenToSell.AMOUNT,
    tokenToSell.TOKEN,
    tokensRoute
  ]);

  const uiPriceImpactGetter = useCallback(async () => {
    const isMultiHopPathAvailable = isMultiHopSwapAvailable(tokensRoute);
    if (settings.current.multihops && isMultiHopPathAvailable) {
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
