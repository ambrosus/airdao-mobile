import { useMemo } from 'react';
import { useSwapContextSelector } from '@features/swap/context';

export function useSwapTokens() {
  const { selectedTokens, selectedTokensAmount } = useSwapContextSelector();

  const tokenToSell = useMemo(() => {
    const { TOKEN_A } = selectedTokens;
    const { TOKEN_A: AMOUNT_A } = selectedTokensAmount;

    return {
      TOKEN: TOKEN_A,
      AMOUNT: AMOUNT_A
    };
  }, [selectedTokens, selectedTokensAmount]);

  const tokenToReceive = useMemo(() => {
    const { TOKEN_B } = selectedTokens;
    const { TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    return {
      TOKEN: TOKEN_B,
      AMOUNT: AMOUNT_B
    };
  }, [selectedTokens, selectedTokensAmount]);

  const executedTokensAddresses = useMemo(() => {
    const [addressA, addressB] = [
      tokenToSell.TOKEN?.address,
      tokenToReceive.TOKEN?.address
    ];

    return { addressA, addressB };
  }, [tokenToSell, tokenToReceive]);

  const tokensRoute = useMemo(() => {
    const [addressA, addressB] = [
      tokenToSell.TOKEN?.address,
      tokenToReceive.TOKEN?.address
    ];

    if (!addressA || !addressB) return ['', ''];

    return [addressA, addressB];
  }, [tokenToReceive, tokenToSell]);

  return {
    tokenToSell,
    tokenToReceive,
    executedTokensAddresses,
    tokensRoute
  };
}
