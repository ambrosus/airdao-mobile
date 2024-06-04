import { useEffect, useState } from 'react';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface/service/dex-swap.service';
import { TokenInfo } from '@/features/dex-swap-interface/types';
import { NumberUtils } from '@utils/number';
import { formatEther } from 'ethers/lib/utils';

type SelectedBalanceStateKeys = '_hex' | 'beatufied';

export function useDEXSwapBalance(token: TokenInfo) {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const { selectedAccount } = useBridgeContextSelector();

  const [selectedTokenBalance, setSelectedTokenBalance] = useState<
    Record<SelectedBalanceStateKeys, string | null>
  >({
    _hex: null,
    beatufied: null
  });

  useEffect(() => {
    if (selectedAccount?.address && !!token) {
      (async () => {
        try {
          setIsFetchingBalance(true);
          const bnBalance = await DEXSwapInterfaceService.balanceOf({
            token,
            ownerAddress: selectedAccount?.address
          });

          setSelectedTokenBalance({
            _hex: bnBalance,
            beatufied:
              NumberUtils.limitDecimalCount(formatEther(bnBalance?._hex), 2) ||
              ''
          });
        } catch (error) {
          throw error;
        } finally {
          setIsFetchingBalance(false);
        }
      })();
    }
  }, [selectedAccount, token]);

  return { selectedTokenBalance, isFetchingBalance };
}
