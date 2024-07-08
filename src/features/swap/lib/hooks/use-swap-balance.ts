import { useCallback, useState } from 'react';
import { BigNumber } from 'ethers/lib/ethers';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { SwapToken } from '@features/swap/types';
import { getBalanceOf } from '../contracts';
import { useFocusEffect } from '@react-navigation/native';

export function useSwapBalance(token: SwapToken | null) {
  const { selectedAccount } = useBridgeContextSelector();

  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [bnBalanceAmount, setBnBalanceAmount] = useState<BigNumber | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedAccount?.address && !!token) {
        (async () => {
          setIsFetchingBalance(true);
          try {
            const bnBalance = await getBalanceOf({
              token,
              ownerAddress: selectedAccount?.address
            });

            setBnBalanceAmount(bnBalance);
          } catch (error) {
            throw error;
          } finally {
            setIsFetchingBalance(false);
          }
        })();
      }
    }, [selectedAccount?.address, token])
  );

  return { isFetchingBalance, bnBalanceAmount };
}
