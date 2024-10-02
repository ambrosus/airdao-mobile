import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import {
  dexValidators,
  extractArrayOfMiddleMultiHopAddresses,
  isMultiHopSwapAvailable
} from '@features/swap/utils';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapSettings } from './use-swap-settings';

export function useSwapBetterRate() {
  const { getTokenAmountIn, getTokenAmountInWithMultiRoute } =
    useSwapBetterCurrency();
  const { isExactInRef } = useSwapContextSelector();
  const { settings } = useSwapSettings();

  const bestSwapRate = useCallback(
    async (amountToSell: string, path: string[]) => {
      if (dexValidators.isEmptyAmount(amountToSell)) return BigNumber.from('0');

      const tradeIn = isExactInRef.current;
      const { multihops } = settings.current;

      const isMultiHopRouteSupported = isMultiHopSwapAvailable(path);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        singleHopAmount = await getTokenAmountIn(amountToSell, path);
      } catch (error) {
        console.error('Error fetching single-hop amount:', error);
      }

      if (!isMultiHopRouteSupported || !multihops) {
        return singleHopAmount;
      }

      // Calculate multi-hop amount
      try {
        const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path);
        if (tradeIn) {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        } else {
          multiHopAmount = await getTokenAmountInWithMultiRoute(
            amountToSell,
            path,
            middleHopAddress.address
          );
        }
      } catch (error) {
        return await getTokenAmountIn(amountToSell, path);
      }

      return singleHopAmount.isZero()
        ? multiHopAmount
        : singleHopAmount.lt(multiHopAmount)
        ? singleHopAmount
        : multiHopAmount;
    },
    [getTokenAmountIn, getTokenAmountInWithMultiRoute, isExactInRef, settings]
  );

  return { bestSwapRate };
}
