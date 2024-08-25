import { useCallback, useMemo } from 'react';
import {
  wrapNativeAddress,
  isNativeWrapped,
  isMultiHopSwapAvailable
} from '@features/swap/utils';
import { Cache, CacheKey } from '@lib/cache';

import { useSwapTokens } from './use-swap-tokens';
import { useBridgeContextData } from '@features/bridge/context';
import { ethers } from 'ethers';

export function useSwapHelpers() {
  const { selectedAccount } = useBridgeContextData();
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

  const _privateKeyGetter = useCallback(async () => {
    return (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw.hash ?? ''}`
    )) as string;
  }, [selectedAccount?._raw]);

  const isStartsWithETH = useMemo(() => {
    return tokenToSell.TOKEN?.address === ethers.constants.AddressZero;
  }, [tokenToSell]);

  const isEndsWithETH = useMemo(() => {
    return tokenToReceive.TOKEN?.address === ethers.constants.AddressZero;
  }, [tokenToReceive]);

  const isEmptyAmount = useCallback((amount: string) => {
    return amount === '0' || amount === '';
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
    _privateKeyGetter,
    isStartsWithETH,
    isEmptyAmount,
    isEndsWithETH,
    isMultiHopSwap
  };
}
