import { useCallback, useState } from 'react';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

const BASE_RATE_AMOUNT_TO_SELL = '1';

export function useSwapBetterRate() {
  const { settings } = useSwapSettings();
  const { bestTradeExactIn, bestTradeExactOut } = useSwapBetterCurrency();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const [isTradeIn, setIsTradeIn] = useState(false);

  const [isExecutingRate, setIsExecutingRate] = useState(false);

  const [tokens, setTokens] = useState({
    symbolInput: tokenToReceive.TOKEN.symbol,
    symbolOutput: tokenToSell.TOKEN.symbol
  });

  const onToggleTokensOrder = useCallback(
    () => setIsTradeIn((prevState) => !prevState),
    []
  );

  const bestSwapRate = useCallback(
    async (path: string[]) => {
      setIsExecutingRate(true);
      try {
        const reversedPath = path;
        const {
          current: { multihops }
        } = settings;

        const amount = isTradeIn
          ? await bestTradeExactOut(
              BASE_RATE_AMOUNT_TO_SELL,
              reversedPath,
              multihops
            )
          : await bestTradeExactIn(
              BASE_RATE_AMOUNT_TO_SELL,
              reversedPath,
              multihops
            );

        if (amount) {
          const tokenA = tokenToSell.TOKEN.symbol;
          const tokenB = tokenToReceive.TOKEN?.symbol;

          setTokens({
            symbolInput: isTradeIn ? tokenA : tokenB,
            symbolOutput: isTradeIn ? tokenB : tokenA
          });
        }

        return amount;
      } catch (error) {
        throw error;
      } finally {
        setIsExecutingRate(false);
      }
    },
    [
      bestTradeExactIn,
      bestTradeExactOut,
      isTradeIn,
      settings,
      tokenToReceive.TOKEN?.symbol,
      tokenToSell.TOKEN.symbol
    ]
  );

  return {
    bestSwapRate,
    onToggleTokensOrder,
    isTradeIn,
    tokens,
    isExecutingRate
  };
}
