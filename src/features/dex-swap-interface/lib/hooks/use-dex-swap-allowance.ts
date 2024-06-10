import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface/service/dex-swap.service';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { Cache, CacheKey } from '@lib/cache';
import { useBridgeContextSelector } from '@contexts/Bridge';

export function useDEXSwapAllowance() {
  const { selectedAccount } = useBridgeContextSelector();
  const { selectedTokens, selectedTokensAmount } = useDEXSwapContextSelector();
  const [isAllowanceLower, setIsAllowanceLower] = useState(null);
  const [isAllowanceProcessing, setIsAllowanceProcessing] = useState(false);

  const isEmptyAmount = useMemo(() => {
    return (
      selectedTokensAmount.INPUT === '' || selectedTokensAmount.OUTPUT === ''
    );
  }, [selectedTokensAmount]);

  const fetchAllowance = useCallback(async () => {
    try {
      setIsAllowanceProcessing(true);
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw?.hash ?? ''}`
      )) as string;

      const allowance = await DEXSwapInterfaceService.checkAllowance({
        addressFrom: selectedTokens[FIELD.INPUT]?.address ?? '',
        privateKey: privateKey ?? '',
        amountAllowance: selectedTokensAmount[FIELD.INPUT]
      });

      setIsAllowanceLower(allowance);
    } finally {
      setIsAllowanceProcessing(false);
    }

    // @ts-ignore
  }, [selectedAccount?._raw?.hash, selectedTokens, selectedTokensAmount]);

  useEffect(() => {
    (async () => {
      if (!isEmptyAmount) {
        fetchAllowance();
      }
    })();
  }, [
    fetchAllowance,
    isEmptyAmount,
    // @ts-ignore
    selectedAccount._raw.hash,
    selectedTokens,
    selectedTokensAmount
  ]);

  const increaseAllowance = useCallback(async () => {
    try {
      setIsAllowanceProcessing(true);
      const privateKey = (await Cache.getItem(
        // @ts-ignore
        `${CacheKey.WalletPrivateKey}-${selectedAccount?._raw?.hash ?? ''}`
      )) as string;

      const allowance = await DEXSwapInterfaceService.setAllowance({
        addressFrom: selectedTokens[FIELD.INPUT]?.address ?? '',
        privateKey: privateKey ?? '',
        amountAllowance: selectedTokensAmount[FIELD.INPUT]
      });

      const result = await allowance.wait();

      if (result) {
        fetchAllowance();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsAllowanceProcessing(false);
    }
  }, [
    fetchAllowance,
    // @ts-ignore
    selectedAccount?._raw?.hash,
    selectedTokens,
    selectedTokensAmount
  ]);

  return { isAllowanceLower, increaseAllowance, isAllowanceProcessing };
}
