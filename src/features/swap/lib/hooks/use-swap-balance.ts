import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BigNumber } from 'ethers/lib/ethers';
import { useWalletStore } from '@entities/wallet';
import { SwapToken } from '@features/swap/types';
import { erc20Contracts } from '@lib/erc20/erc20.contracts';

export function useSwapBalance(token: SwapToken | null) {
  const { wallet } = useWalletStore();
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
            const bnBalance = await erc20Contracts.balanceOf({
              tokenAddress: token.address,
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
