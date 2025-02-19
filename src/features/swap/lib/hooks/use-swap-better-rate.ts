import { useCallback, useState } from 'react';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

const BASE_RATE_AMOUNT_TO_SELL = '1';

export function useSwapBetterRate() {
  const { bestTradeExactIn, bestTradeExactOut } = useSwapBetterCurrency();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const [isTradeIn, setIsTradeIn] = useState(false);
  const { _refSettingsGetter } = useSwapSettings();

  const [isExecutingRate, setIsExecutingRate] = useState(false);

  const [oppositeAmountPerOneToken, setOppositeAmountPerOneToken] =
    useState('0');

  const [tokens, setTokens] = useState({
    symbolInput: tokenToReceive.TOKEN.symbol,
    symbolOutput: tokenToSell.TOKEN.symbol
  });

  const onToggleTokensOrder = useCallback(() => {
    setIsExecutingRate(true);
    setOppositeAmountPerOneToken('0');
    setIsTradeIn((prevState) => !prevState);
  }, []);

  const bestSwapRate = useCallback(
    async (path: string[]) => {
      try {
        const reversedPath = path;
        const singleHopOnly = _refSettingsGetter.multihops;

        const amount = isTradeIn
          ? await bestTradeExactOut(
              BASE_RATE_AMOUNT_TO_SELL,
              reversedPath,
              singleHopOnly
            )
          : await bestTradeExactIn(
              BASE_RATE_AMOUNT_TO_SELL,
              reversedPath,
              singleHopOnly
            );

        if (amount) {
          const tokenA = tokenToSell.TOKEN.symbol;
          const tokenB = tokenToReceive.TOKEN?.symbol;

          setTokens({
            symbolInput: isTradeIn ? tokenA : tokenB,
            symbolOutput: isTradeIn ? tokenB : tokenA
          });
        }

        setIsExecutingRate(false); // Set loading to false after calculation
        return amount;
      } catch (error) {
        setIsExecutingRate(false); // Set loading to false on error
        throw error;
      }
    },
    [
      _refSettingsGetter.multihops,
      bestTradeExactIn,
      bestTradeExactOut,
      isTradeIn,
      tokenToReceive.TOKEN?.symbol,
      tokenToSell.TOKEN.symbol
    ]
  );

  return {
    bestSwapRate,
    onToggleTokensOrder,
    isTradeIn,
    tokens,
    isExecutingRate,
    oppositeAmountPerOneToken,
    setOppositeAmountPerOneToken
  };
}
