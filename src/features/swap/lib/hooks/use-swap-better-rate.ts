import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { SwapStringUtils } from '@features/swap/utils/transformers';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapSettings } from './use-swap-settings';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapBetterRate() {
  const { bestTradeExactIn, bestTradeExactOut } = useSwapBetterCurrency();
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const [isTradeIn, setIsTradeIn] = useState(false);
  const { _refSettingsGetter } = useSwapSettings();
  const { selectedTokensAmount } = useSwapContextSelector();

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
      const { TOKEN_A: amountA, TOKEN_B: amountB } = selectedTokensAmount;
      try {
        const singleHopOnly = _refSettingsGetter.multihops;

        const amount = !isTradeIn
          ? await bestTradeExactOut(amountA, path, singleHopOnly)
          : await bestTradeExactIn(amountB, path, singleHopOnly);

        if (amount) {
          const inputAmountNum = +(!isTradeIn ? amountA : amountB);
          const outputAmountNum = +ethers.utils.formatEther(amount);
          const ratePerToken = inputAmountNum / outputAmountNum;

          setOppositeAmountPerOneToken(
            SwapStringUtils.transformCurrencyRate(ratePerToken)
          );

          const tokenA = tokenToSell.TOKEN.symbol;
          const tokenB = tokenToReceive.TOKEN?.symbol;

          setTokens({
            symbolInput: isTradeIn ? tokenA : tokenB,
            symbolOutput: isTradeIn ? tokenB : tokenA
          });

          setIsExecutingRate(false);
          return ratePerToken;
        }
      } catch (error) {
        setIsExecutingRate(false);
        throw error;
      }
    },
    [
      _refSettingsGetter.multihops,
      bestTradeExactIn,
      bestTradeExactOut,
      isTradeIn,
      selectedTokensAmount,
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
