import { useCallback, useState } from 'react';
import Config from '@constants/config';
import { useStakeHBRStore } from '@entities/harbor';
import { useWalletPrivateKey, useWalletStore } from '@entities/wallet';
import { useStakeHBRActionsStore } from '@features/harbor/model';
import { erc20Contracts } from '@lib/erc20/erc20.contracts';

export function useApproveContract() {
  const { wallet } = useWalletStore();
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { amount } = useStakeHBRActionsStore();
  const { fetchUserAllowance } = useStakeHBRStore();

  const [approving, setApproving] = useState(false);

  const approve = useCallback(async () => {
    setApproving(true);
    try {
      const privateKey = await _extractPrivateKey();

      const addresses = {
        spenderAddress: Config.HBR_LIQUIDITY_POOL,
        tokenAddress: Config.HBR_TOKEN_ADDRESS
      } as const;

      const tx = await erc20Contracts.setAllowance({
        ...addresses,
        amount,
        privateKey
      });

      if (await tx.wait()) {
        fetchUserAllowance(wallet?.address ?? '');
      }
    } catch (error) {
      console.error('Error approving contract:', error);
      throw error;
    } finally {
      setApproving(false);
    }
  }, [_extractPrivateKey, amount, fetchUserAllowance, wallet]);

  return { approving, approve };
}
