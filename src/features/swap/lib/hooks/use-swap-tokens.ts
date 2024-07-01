import { useMemo } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { isMultiRouteWithUSDCFirst } from '@features/swap/utils';

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

  const tokenToSellKey = useMemo(() => {
    return FIELD.TOKEN_A;
  }, []);

  const tokenToReceiveKey = useMemo(() => {
    return FIELD.TOKEN_B;
  }, []);

  const executedTokensAddresses = useMemo(() => {
    const [addressA, addressB] = [
      tokenToSell.TOKEN?.address,
      tokenToReceive.TOKEN?.address
    ];

    return { addressA, addressB };
  }, [tokenToSell, tokenToReceive]);

  const isMultiHopSwap = useMemo(() => {
    const { addressA, addressB } = executedTokensAddresses;
    const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
      [addressA, addressB].join()
    );

    return isMuliRouteUSDCSwap;
  }, [executedTokensAddresses]);

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
    tokenToSellKey,
    tokenToReceiveKey,
    executedTokensAddresses,
    isMultiHopSwap,
    tokensRoute
  };
}
