import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import { ethers } from 'ethers';
import { hbrYieldService } from '@api/harbor';
import { CryptoCurrencyCode } from '@appTypes';
import { useWalletPrivateKey } from '@entities/wallet';

export function useWithdrawalActions(
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR,
  amountToWithdraw: string
) {
  const [loading, setLoading] = useState(false);
  const { _extractPrivateKey } = useWalletPrivateKey();

  const handleWithdrawHBR = useCallback(async () => {
    try {
      setLoading(true);
      const privateKey = await _extractPrivateKey();
      const bnAmountToWithdraw = ethers.utils.parseEther(amountToWithdraw);
      return await hbrYieldService.withdraw(bnAmountToWithdraw, privateKey);
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
      return await hbrYieldService.unstake(bnAmountToWithdraw, privateKey);
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

  return { withdrawalCallback, loading };
}
