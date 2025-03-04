import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapBetterRate() {
  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const [isTradeIn, setIsTradeIn] = useState(false);

  const { selectedTokensAmount, _refExactGetter } = useSwapContextSelector();

  const [isExecutingRate, setIsExecutingRate] = useState(false);

  const [rate, setRate] = useState<string | number>(Infinity);

  const [tokens, setTokens] = useState({
    symbolInput: tokenToReceive.TOKEN.symbol,
    symbolOutput: tokenToSell.TOKEN.symbol
  });

  const onToggleTokensOrder = useCallback(() => {
    setIsExecutingRate(true);
    setRate('0');
    setIsTradeIn((prevState) => !prevState);
  }, []);

  const bestSwapRate = useCallback(() => {
    const { TOKEN_A: amountA, TOKEN_B: amountB } = selectedTokensAmount;

    setRate('0');

    const isExactTradeIn = _refExactGetter;
    const tokenA = tokenToSell.TOKEN.symbol;
    const tokenB = tokenToReceive.TOKEN?.symbol;

    setTokens({
      symbolInput: isTradeIn ? tokenA : tokenB,
      symbolOutput: isTradeIn ? tokenB : tokenA
    });

    if (+amountA > 0 && +amountB > 0) {
      try {
        // Convert to BigNumber for precision
        const bnAmountA = ethers.utils.parseUnits(amountA.toString(), 18);
        const bnAmountB = ethers.utils.parseUnits(amountB.toString(), 18);

        // Calculate rate with BigNumber
        let rate;
        if (isExactTradeIn) {
          rate = isTradeIn
            ? bnAmountB.mul(ethers.constants.WeiPerEther).div(bnAmountA)
            : bnAmountA.mul(ethers.constants.WeiPerEther).div(bnAmountB);
        } else {
          rate = isTradeIn
            ? bnAmountB.mul(ethers.constants.WeiPerEther).div(bnAmountA)
            : bnAmountA.mul(ethers.constants.WeiPerEther).div(bnAmountB);
        }

        setIsExecutingRate(false);
        return ethers.utils.formatUnits(rate, 18);
      } catch (error) {
        console.error('Error calculating swap rate:', error);
        return '0';
      }
    }
  }, [
    selectedTokensAmount,
    _refExactGetter,
    tokenToSell.TOKEN.symbol,
    tokenToReceive.TOKEN?.symbol,
    isTradeIn
  ]);

  return {
    bestSwapRate,
    onToggleTokensOrder,
    isTradeIn,
    tokens,
    isExecutingRate,
    rate,
    setRate
  };
}
