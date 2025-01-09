import { useCallback } from 'react';
import { extractArrayOfMiddleMultiHopAddresses } from '@features/swap/utils';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapSettings } from './use-swap-settings';

const BASE_RATE_AMOUNT_TO_SELL = '1';

export function useSwapBetterRate() {
  const { settings } = useSwapSettings();
  const { bestTradeExactIn } = useSwapBetterCurrency();

  const bestSwapRate = useCallback(
    async (path: string[]) => {
      const reversedPath = path;
      const {
        current: { multihops }
      } = settings;

      return await bestTradeExactIn(
        BASE_RATE_AMOUNT_TO_SELL,
        reversedPath,
        multihops,
        extractArrayOfMiddleMultiHopAddresses(reversedPath).address
      );
    },
    [bestTradeExactIn, settings]
  );

  return { bestSwapRate };
}
