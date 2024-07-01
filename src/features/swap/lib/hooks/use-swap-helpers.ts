import { useCallback, useMemo } from 'react';
import {
  wrapNativeAddress,
  isNativeWrapped,
  multiRouteAddresses,
  isMultiRouteWithUSDCFirst
} from '@features/swap/utils';
import { Cache, CacheKey } from '@lib/cache';

import { useSwapTokens } from './use-swap-tokens';
import { useBridgeContextSelector } from '@contexts/Bridge';

export function useSwapHelpers() {
  const { selectedAccount } = useBridgeContextSelector();
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
    return tokenToSell.TOKEN?.address === multiRouteAddresses.AMB;
  }, [tokenToSell]);

  const isEndsWithETH = useMemo(() => {
    return tokenToReceive.TOKEN?.address === multiRouteAddresses.AMB;
  }, [tokenToReceive]);

  const isEmptyAmount = useCallback((amount: string) => {
    return amount === '0' || amount === '';
  }, []);

  const isMultiHopSwap = useMemo(() => {
    const { addressA, addressB } = executedTokensAddresses;
    const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
      [addressA, addressB].join()
    );

    return isMuliRouteUSDCSwap;
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
