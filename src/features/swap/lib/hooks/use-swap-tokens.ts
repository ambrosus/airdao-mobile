import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import {
  isMultiRouteWithUSDCFirst,
  isMultiRouteWithBONDFirst
} from '@features/swap/utils';
import { useMemo } from 'react';

export function useSwapTokens() {
  const { selectedTokens, selectedTokensAmount, isExactInRef } =
    useSwapContextSelector();

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

    const isMuliRouteBONDSwap = isMultiRouteWithBONDFirst.has(
      [addressA, addressB].join()
    );

    return (
      (isExactInRef.current && isMuliRouteUSDCSwap) ||
      (!isExactInRef.current && isMuliRouteBONDSwap)
    );
  }, [executedTokensAddresses, isExactInRef]);

  return {
    tokenToSell,
    tokenToReceive,
    tokenToSellKey,
    tokenToReceiveKey,
    executedTokensAddresses,
    isMultiHopSwap
  };
}
