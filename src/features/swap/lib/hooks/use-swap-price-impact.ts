import { useCallback } from 'react';
import { ethers } from 'ethers';
import { AMB_DECIMALS } from '@constants/variables';
import { useSwapContextSelector } from '@features/swap/context';
import { getAmountsIn, getAmountsOut } from '@features/swap/lib/contracts';
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
  const { getPairAddress, getReserves } = useAllLiquidityPools();
  const { hasWrapNativeToken } = useSwapHelpers();
  const { settings } = useSwapSettings();
  const { tokenToSell, tokenToReceive, tokensRoute } = useSwapTokens();
  const { isExactInRef } = useSwapContextSelector();

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
            const bnAmountOut = ethers.utils.parseEther(amountToReceive);

            const impact = singleHopImpact(
              amountToSell,
              bnAmountOut,
              reserveIn,
              reserveOut
            );

            return Number(
              Number(+impact >= 0 ? impact : -impact).toFixed(AMB_DECIMALS)
            );
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

  const multiHopImpactGetter = useCallback(
    async (_path?: string[], _amountIn?: string, isTradeIn?: boolean) => {
      const path = withMultiHopPath(
        _path ?? [
          tokenToSell.TOKEN?.address ?? '',
          tokenToReceive.TOKEN?.address ?? ''
        ]
      );

      try {
        const amountIn = ethers.utils.parseEther(
          _amountIn ?? tokenToSell.AMOUNT
        );

        const amounts = !isTradeIn
          ? await getAmountsIn({
              path,
              amountToReceive: amountIn
            })
          : await getAmountsOut({
              path,
              amountToSell: amountIn
            });

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

          totalImpact = multiHopCumulativeImpact(
            totalImpact.toString(),
            (+impact >= 0 ? impact : -impact).toString()
          );
        }

        return Math.abs(totalImpact);
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
    [
      getPairAddress,
      getReserves,
      tokenToReceive.TOKEN,
      tokenToSell.AMOUNT,
      tokenToSell.TOKEN
    ]
  );

  const uiPriceImpactGetter = useCallback(async () => {
    const isMultiHopPathAvailable = isMultiHopSwapAvailable(tokensRoute);
    const isTradeIn = isExactInRef.current;
    if (settings.current.multihops && isMultiHopPathAvailable) {
      return await multiHopImpactGetter(
        undefined,
        tokenToSell.AMOUNT,
        isTradeIn
      );
    } else {
      return await singleHopImpactGetter(
        tokenToSell.AMOUNT,
        tokenToReceive.AMOUNT
      );
    }
  }, [
    tokensRoute,
    isExactInRef,
    settings,
    multiHopImpactGetter,
    tokenToSell.AMOUNT,
    singleHopImpactGetter,
    tokenToReceive.AMOUNT
  ]);

  return {
    multiHopImpactGetter,
    singleHopImpactGetter,
    singleHopImpact,
    uiPriceImpactGetter
  };
}
