import { useCallback, useState } from 'react';
import { BigNumber } from 'ethers/lib/ethers';
import { SwapToken } from '@features/swap/types';
import { getBalanceOf } from '../contracts';
import { useFocusEffect } from '@react-navigation/native';
import { useWallet } from '@hooks';

export function useSwapBalance(token: SwapToken | null) {
  const { wallet } = useWallet();
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [bnBalanceAmount, setBnBalanceAmount] = useState<BigNumber | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      if (wallet?.address && !!token) {
        (async () => {
          setIsFetchingBalance(true);
          try {
            const bnBalance = await getBalanceOf({
              token,
              ownerAddress: wallet?.address
            });

            setBnBalanceAmount(bnBalance);
          } catch (error) {
            throw error;
          } finally {
            setIsFetchingBalance(false);
          }
        })();
      }
    }, [token, wallet?.address])
  );

  return { isFetchingBalance, bnBalanceAmount };
}
