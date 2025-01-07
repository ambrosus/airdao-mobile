import React, { useMemo } from 'react';
import { CryptoCurrencyCode } from '@appTypes';
import { TextOrSpinner } from '@components/composite';
import { SecondaryButton } from '@components/modular';
import { useStakeHBRStore } from '@entities/harbor';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import { useWithdrawalActions } from '@features/harbor/lib/hooks';

interface WithdrawalButtonProps {
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  logs: IAvailableWithdrawLogs | null;
}

export const WithdrawalButton = ({ token, logs }: WithdrawalButtonProps) => {
  const { deposit, stake } = useStakeHBRStore();
  const { withdrawalCallback, loading } = useWithdrawalActions(token);

  const disabled = useMemo(() => {
    const isErrorLog = logs?.status === 'error';
    switch (token) {
      case CryptoCurrencyCode.HBR: {
        return (
          deposit.isZero() || !stake.isZero() || (logs ? isErrorLog : false)
        );
      }
      case CryptoCurrencyCode.AMB: {
        return stake.isZero() || (logs ? isErrorLog : false);
      }
    }
  }, [deposit, logs, stake, token]);

  return (
    <>
      <SecondaryButton disabled={disabled} onPress={withdrawalCallback}>
        <TextOrSpinner
          label="Withdraw"
          loadingLabel={undefined}
          loading={loading}
        />
      </SecondaryButton>
    </>
  );
};
