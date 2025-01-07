import { useCallback, useState } from 'react';
import { hbrYieldService } from '@api/harbor';
import { CryptoCurrencyCode } from '@appTypes';
import { useStakeHBRStore } from '@entities/harbor';
import { useWalletPrivateKey } from '@entities/wallet';

export function useWithdrawalActions(
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR
) {
  const [loading, setLoading] = useState(false);
  const { _extractPrivateKey } = useWalletPrivateKey();

  const { deposit } = useStakeHBRStore();

  const handleWithdrawHBR = useCallback(async () => {
    try {
      setLoading(true);
      const privateKey = await _extractPrivateKey();
      await hbrYieldService.withdraw(deposit.div(3), privateKey);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [_extractPrivateKey, deposit]);

  const handleWithdrawAMB = useCallback(async () => {
    try {
      setLoading(true);
      console.warn('AMB');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const withdrawalCallback = useCallback(() => {
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
