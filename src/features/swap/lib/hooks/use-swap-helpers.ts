import { useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import {
  wrapNativeAddress,
  isNativeWrapped,
  isMultiHopSwapAvailable
} from '@features/swap/utils';
import { useSwapTokens } from './use-swap-tokens';

export function useSwapHelpers() {
  const { tokenToSell, tokenToReceive, executedTokensAddresses } =
    useSwapTokens();

  const hasWrapNativeToken = useMemo(() => {
    if (tokenToSell.TOKEN || tokenToReceive.TOKEN) {
      const excludeNativeETH = wrapNativeAddress([
        tokenToSell.TOKEN?.address ?? '',
        tokenToReceive.TOKEN?.address ?? ''
      ]);
      return isNativeWrapped(excludeNativeETH);
    }
  }, [tokenToReceive.TOKEN, tokenToSell.TOKEN]);

  const isStartsWithETH = useMemo(() => {
    return tokenToSell.TOKEN?.address === ethers.constants.AddressZero;
  }, [tokenToSell]);

  const isEndsWithETH = useMemo(() => {
    return tokenToReceive.TOKEN?.address === ethers.constants.AddressZero;
  }, [tokenToReceive]);

  const isEmptyAmount = useCallback((amount: string) => {
    return /^0(\.0+)?$|^0\.$|^$/.test(amount);
  }, []);

  const isMultiHopSwap = useMemo(() => {
    const { addressA, addressB } = executedTokensAddresses;
    const isMultiHopPathAvailable = isMultiHopSwapAvailable([
      addressA ?? '',
      addressB ?? ''
    ]);

    return isMultiHopPathAvailable;
  }, [executedTokensAddresses]);

  return {
    hasWrapNativeToken,
    isStartsWithETH,
    isEmptyAmount,
    isEndsWithETH,
    isMultiHopSwap
  };
}
