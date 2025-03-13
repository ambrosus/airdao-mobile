import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheetRef } from '@components/composite';
import { KEYBOARD_OPENING_TIME } from '@constants/variables';
import { useStakeHBRStore } from '@entities/harbor';
import { getTimestampFromBlockHash } from '@entities/harbor/utils';
import { useWalletPrivateKey } from '@entities/wallet';

export function useWithdrawalActions(
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR,
  amountToWithdraw: string
) {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { stake, deposit } = useStakeHBRStore();

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

  const handleWithdrawHBR = useCallback(
    async ({ estimateGas = false }: { estimateGas?: boolean } = {}) => {
      try {
        setLoading(true);
        const privateKey = await _extractPrivateKey();
        const bnAmountToWithdraw = !!estimateGas
          ? deposit
          : ethers.utils.parseEther(amountToWithdraw);

        const tx = await hbrYieldService.withdraw(
          bnAmountToWithdraw,
          privateKey,
          { estimateGas }
        );

        if (estimateGas) {
          return tx;
        }

        if (tx) {
          setTransaction(tx);
          setTimeout(() => bottomSheetRef.current?.show(), 500);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [_extractPrivateKey, amountToWithdraw, deposit]
  );

  const handleWithdrawAMB = useCallback(
    async ({ estimateGas = false }: { estimateGas?: boolean } = {}) => {
      try {
        setLoading(true);
        const privateKey = await _extractPrivateKey();
        const bnAmountToWithdraw = !!estimateGas
          ? stake
          : ethers.utils.parseEther(amountToWithdraw);

        const tx = await hbrYieldService.unstake(
          bnAmountToWithdraw,
          privateKey,
          { estimateGas }
        );

        if (estimateGas) {
          return tx;
        }

        if (tx) {
          setTransaction(tx);

          setTimeout(
            () => bottomSheetRef.current?.show(),
            KEYBOARD_OPENING_TIME
          );
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [_extractPrivateKey, amountToWithdraw, stake]
  );

  const withdrawalCallback = useCallback(
    async ({ estimateGas = false }: { estimateGas?: boolean } = {}) => {
      Keyboard.dismiss();
      switch (token) {
        case CryptoCurrencyCode.AMB: {
          return handleWithdrawAMB({ estimateGas });
        }
        case CryptoCurrencyCode.HBR: {
          return handleWithdrawHBR({ estimateGas });
        }
      }
    },
    [handleWithdrawAMB, handleWithdrawHBR, token]
  );

  return {
    withdrawalCallback,
    handleWithdrawAMB,
    loading,
    timestamp,
    transaction,
    bottomSheetRef
  };
}
