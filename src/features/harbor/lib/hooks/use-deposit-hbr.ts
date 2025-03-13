import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor';
import { getTimestampFromBlockHash } from '@entities/harbor/utils';
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
      setTimestamp((await getTimestampFromBlockHash(transaction)) ?? 0);
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

  const estimateTransactionGas = useCallback(
    async (hbrAmount?: string) => {
      const privateKey = await _extractPrivateKey();
      return await hbrYieldService._deposit(
        hbrAmount ?? amount,
        wallet,
        privateKey,
        {
          estimateGas: true
        }
      );
    },
    [_extractPrivateKey, amount, wallet]
  );

  return {
    _deposit,
    estimateTransactionGas,
    loading,
    success,
    transaction,
    timestamp
  };
}
