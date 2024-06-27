import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import {
  isMultiRouteWithUSDCFirst,
  isMultiRouteWithBONDFirst
} from '@features/swap/utils';
import { useMemo } from 'react';

export function useSwapTokens() {
  const {
    selectedTokens,
    selectedTokensAmount,
    isReversedTokens,
    _refExactGetter,
    isExactInRef
  } = useSwapContextSelector();

  const tokenToSell = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    const token = _refExactGetter ? TOKEN_A : TOKEN_B;
    const amount = _refExactGetter ? AMOUNT_A : AMOUNT_B;

    return {
      TOKEN: isReversedTokens ? TOKEN_A : token,
      AMOUNT: isReversedTokens ? AMOUNT_A : amount
    };
  }, [selectedTokens, selectedTokensAmount, isReversedTokens, _refExactGetter]);

  const tokenToReceive = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = selectedTokens;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedTokensAmount;

    const token = _refExactGetter ? TOKEN_B : TOKEN_A;
    const amount = _refExactGetter ? AMOUNT_B : AMOUNT_A;

    return {
      TOKEN: token,
      AMOUNT: amount
    };
  }, [_refExactGetter, selectedTokens, selectedTokensAmount]);

  const tokenToSellKey = useMemo(() => {
    return isExactInRef.current ? FIELD.TOKEN_A : FIELD.TOKEN_B;
  }, [isExactInRef]);

  const tokenToReceiveKey = useMemo(() => {
    return isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A;
  }, [isExactInRef]);

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
