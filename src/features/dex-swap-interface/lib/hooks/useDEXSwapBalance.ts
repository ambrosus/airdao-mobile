import { useEffect, useState } from 'react';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface/service/dex-swap.service';
import { TokenInfo } from '@/features/dex-swap-interface/types';

export function useDEXSwapBalance(token: TokenInfo) {
  const { selectedAccount } = useBridgeContextSelector();

  const [selectedTokenBalance, setSelectedTokenBalance] = useState(null);

  useEffect(() => {
    if (selectedAccount?.address) {
      (async () => {
        const _balance = await DEXSwapInterfaceService.balanceOf({
          token,
          ownerAddress: selectedAccount?.address
        });

        setSelectedTokenBalance(_balance);
      })();
    }
  }, [selectedAccount, token]);

  return { selectedTokenBalance };
}
