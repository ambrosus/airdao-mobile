import { useBridgeContextSelector } from '@contexts/Bridge';
import { SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { useEffect, useState } from 'react';
import { getBalanceOf } from '../contracts';
import { BigNumber } from 'ethers/lib/ethers';

export function useSwapBalance(
  token: SwapToken | null,
  type: SelectedTokensKeys
) {
  const { selectedAccount } = useBridgeContextSelector();

  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [bnBalanceAmount, setBnBalanceAmount] = useState<BigNumber | null>(
    null
  );

  useEffect(() => {
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
  }, [selectedAccount?.address, token, type]);

  return { isFetchingBalance, bnBalanceAmount };
}
