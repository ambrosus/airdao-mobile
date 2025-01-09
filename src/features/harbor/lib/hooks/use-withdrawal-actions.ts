import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { getTimestampFromBlockHash } from '@entities/harbor/utils';
import { useWalletPrivateKey } from '@entities/wallet';

export function useWithdrawalActions(
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR,
  amountToWithdraw: string
) {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [transaction, setTransaction] = useState<ethers.ContractReceipt | null>(
    null
  );

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  useEffect(() => {
    const timestampHandler = async () => {
      setTimestamp((await getTimestampFromBlockHash(transaction)) ?? 0);
    };
    timestampHandler();
  }, [transaction]);

  const handleWithdrawHBR = useCallback(async () => {
    try {
      setLoading(true);
      const privateKey = await _extractPrivateKey();
      const bnAmountToWithdraw = ethers.utils.parseEther(amountToWithdraw);
      const tx = await hbrYieldService.withdraw(bnAmountToWithdraw, privateKey);

      if (tx) {
        setTransaction(tx);
        setTimeout(() => bottomSheetRef.current?.show(), 500);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [_extractPrivateKey, amountToWithdraw]);

  const handleWithdrawAMB = useCallback(async () => {
    try {
      setLoading(true);
      const privateKey = await _extractPrivateKey();
      const bnAmountToWithdraw = ethers.utils.parseEther(amountToWithdraw);
      const tx = await hbrYieldService.unstake(bnAmountToWithdraw, privateKey);

      if (tx) {
        setTransaction(tx);

        setTimeout(() => bottomSheetRef.current?.show(), 500);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [_extractPrivateKey, amountToWithdraw]);

  const withdrawalCallback = useCallback(() => {
    Keyboard.dismiss();
    switch (token) {
      case CryptoCurrencyCode.AMB: {
        return handleWithdrawAMB();
      }
      case CryptoCurrencyCode.HBR: {
        return handleWithdrawHBR();
      }
    }
  }, [handleWithdrawAMB, handleWithdrawHBR, token]);

  return {
    withdrawalCallback,
    loading,
    timestamp,
    transaction,
    bottomSheetRef
  };
}
