import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import {
  extractArrayOfMiddleMultiHopAddresses,
  isMultiHopSwapAvailable
} from '@features/swap/utils';
import { useSwapSettings } from './use-swap-settings';

const BASE_RATE_AMOUNT_TO_SELL = '1';

export function useSwapBetterRate() {
  const { amountIn, amountInWithHop } = useSwapBetterCurrency();

  const { settings } = useSwapSettings();

  const bestSwapRate = useCallback(
    async (path: string[]) => {
      const { multihops } = settings.current;

      const isMultiHopRouteSupported = isMultiHopSwapAvailable(path);

      let singleHopAmount: BigNumber = BigNumber.from('0');
      let multiHopAmount: BigNumber = BigNumber.from('0');

      try {
        singleHopAmount = await amountIn(BASE_RATE_AMOUNT_TO_SELL, path);
      } catch (error) {
        throw error;
      }

      if (!isMultiHopRouteSupported || !multihops) {
        return singleHopAmount;
      }

      try {
        multiHopAmount = await amountInWithHop(
          BASE_RATE_AMOUNT_TO_SELL,
          path,
          extractArrayOfMiddleMultiHopAddresses(path).address
        );
      } catch (error) {
        return await amountIn(BASE_RATE_AMOUNT_TO_SELL, path);
      }

      return singleHopAmount.isZero()
        ? multiHopAmount
        : singleHopAmount.lt(multiHopAmount)
        ? singleHopAmount
        : multiHopAmount;
    },
    [amountIn, amountInWithHop, settings]
  );

  return { bestSwapRate };
}
