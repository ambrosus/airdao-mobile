import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';
import { TextOrSpinner } from '@components/composite';
import { SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import { useWithdrawalActions } from '@features/harbor/lib/hooks';

interface WithdrawalButtonProps {
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  logs: IAvailableWithdrawLogs | null;
  amountToWithdraw: string;
}

export const WithdrawalButton = ({
  token,
  logs,
  amountToWithdraw
}: WithdrawalButtonProps) => {
  const { deposit, stake } = useStakeHBRStore();
  const { withdrawalCallback, loading } = useWithdrawalActions(
    token,
    amountToWithdraw
  );

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

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      backgroundColor: COLORS[disabled ? 'alphaBlack5' : 'brand600']
    }),
    [disabled]
  );

  return (
    <>
      <SecondaryButton
        style={buttonStyle}
        disabled={disabled || loading}
        onPress={withdrawalCallback}
      >
        <TextOrSpinner
          label="Withdraw"
          loadingLabel={undefined}
          loading={loading}
          styles={{
            active: {
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: COLORS[disabled ? 'neutral400' : 'neutral0']
            },
            loading: {
              fontSize: 14,
              fontFamily: 'Inter_500Medium',
              color: COLORS.neutral0
            }
          }}
          spinnerColor={COLORS.neutral0}
        />
      </SecondaryButton>
    </>
  );
};
