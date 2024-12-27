import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor/hbr-yield.service';
import { getTimestampFromBlockHash } from '@entities/harbor/utils';
import { useWalletPrivateKey, useWalletStore } from '@entities/wallet';
import { useStakeHBRActionsStore } from '@features/harbor/model';

export function useDepositAMB() {
  const { wallet } = useWalletStore();
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { ambAmount } = useStakeHBRActionsStore();

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

  const _depositAmb = useCallback(async () => {
    setLoading(true);
    try {
      const privateKey = await _extractPrivateKey();

      const tx = await hbrYieldService._depositAmb(
        ambAmount,
        wallet,
        privateKey
      );

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
  }, [_extractPrivateKey, ambAmount, wallet]);

  return { _depositAmb, loading, success, transaction, timestamp };
}
