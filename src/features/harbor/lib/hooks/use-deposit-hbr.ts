import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor';
import Config from '@constants/config';
import { useWalletPrivateKey, useWalletStore } from '@entities/wallet';
import { useStakeHBRActionsStore } from '@features/harbor/model';

export function useDepositHBR() {
  const { wallet } = useWalletStore();
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { amount } = useStakeHBRActionsStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [transaction, setTransaction] = useState<ethers.ContractReceipt | null>(
    null
  );

  useEffect(() => {
    const timestampHandler = async () => {
      const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
      if (transaction) {
        setTimestamp(
          (await provider.getBlock(transaction.blockNumber)).timestamp
        );
      }
    };
    timestampHandler();
  }, [transaction]);

  const _deposit = useCallback(async () => {
    setLoading(true);
    try {
      const privateKey = await _extractPrivateKey();

      const tx = await hbrYieldService._deposit(amount, wallet, privateKey);

      if (tx) {
        setTransaction(tx);
        setSuccess(true);
      }
    } catch (error) {
      setSuccess(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [_extractPrivateKey, amount, wallet]);

  return { _deposit, loading, success, transaction, timestamp };
}
