import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { TextOrSpinner } from '@components/composite';
import { SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { IAvailableWithdrawLogs, LogStatus } from '@entities/harbor/types';

interface WithdrawalButtonProps {
  loading?: boolean;
  token: CryptoCurrencyCode.AMB | CryptoCurrencyCode.HBR;
  logs: IAvailableWithdrawLogs | null;
  amountToWithdraw: string;
  onButtonPress?: () => void;
}

export const WithdrawalButton = ({
  loading,
  token,
  logs,
  amountToWithdraw,
  onButtonPress
}: WithdrawalButtonProps) => {
  const { t } = useTranslation();

  const { deposit, stake } = useStakeHBRStore();

  const disabled = useMemo(() => {
    const isErrorLog = logs?.status === LogStatus.ERROR;
    const bnAmountToWithdraw = ethers.utils.parseEther(
      !amountToWithdraw ? '0' : amountToWithdraw
    );

    switch (token) {
      case CryptoCurrencyCode.HBR: {
        const isInsufficientBalance = bnAmountToWithdraw.gt(deposit);
        const isZeroAmount = bnAmountToWithdraw.isZero();
        const isZeroDeposit = deposit.isZero();
        const hasStake = !stake.isZero();

        return (
          loading ||
          isInsufficientBalance ||
          isZeroAmount ||
          isZeroDeposit ||
          hasStake ||
          isErrorLog
        );
      }
      case CryptoCurrencyCode.AMB: {
        const isInsufficientBalance = bnAmountToWithdraw.gt(stake);
        const isZeroAmount = bnAmountToWithdraw.isZero();
        const isZeroStake = stake.isZero();

        return (
          loading ||
          isInsufficientBalance ||
          isZeroAmount ||
          isZeroStake ||
          isErrorLog
        );
      }
    }
  }, [amountToWithdraw, deposit, loading, logs?.status, stake, token]);

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      backgroundColor: COLORS[disabled ? 'primary50' : 'brand600']
    }),
    [disabled]
  );

  const label = useMemo(() => {
    const bnAmountToWithdraw = ethers.utils.parseEther(
      !amountToWithdraw ? '0' : amountToWithdraw
    );

    if (token === CryptoCurrencyCode.HBR && bnAmountToWithdraw.gt(deposit)) {
      return t('bridge.insufficient.funds');
    }

    if (token === CryptoCurrencyCode.AMB && bnAmountToWithdraw.gt(stake)) {
      return t('bridge.insufficient.funds');
    }

    return t('staking.pool.withdraw');
  }, [amountToWithdraw, deposit, stake, t, token]);

  return (
    <>
      <SecondaryButton
        style={buttonStyle}
        disabled={disabled || loading}
        onPress={onButtonPress}
      >
        <TextOrSpinner
          label={label}
          loadingLabel={undefined}
          loading={!!loading}
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
        />
      </SecondaryButton>
    </>
  );
};
