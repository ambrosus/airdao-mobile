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
  estimatedGas?: ethers.BigNumber;
  ambBalance?: ethers.BigNumber;
}

export const WithdrawalButton = ({
  loading,
  token,
  logs,
  amountToWithdraw,
  onButtonPress,
  estimatedGas,
  ambBalance
}: WithdrawalButtonProps) => {
  const { t } = useTranslation();

  const { deposit, stake } = useStakeHBRStore();

  const disabled = useMemo(() => {
    const isErrorLog = logs?.status === LogStatus.ERROR;
    const bnAmountToWithdraw = ethers.utils.parseEther(
      !amountToWithdraw ? '0' : amountToWithdraw
    );

    if (estimatedGas && ambBalance) {
      const notEnoughBalanceToCoverGas = estimatedGas.gt(ambBalance);

      return notEnoughBalanceToCoverGas || loading;
    }

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
  }, [
    ambBalance,
    amountToWithdraw,
    deposit,
    estimatedGas,
    loading,
    logs?.status,
    stake,
    token
  ]);

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

    if (token)
      if (token === CryptoCurrencyCode.HBR && bnAmountToWithdraw.gt(deposit)) {
        return t('bridge.insufficient.funds');
      }

    if (token === CryptoCurrencyCode.AMB && bnAmountToWithdraw.gt(stake)) {
      return t('bridge.insufficient.funds');
    }

    if (estimatedGas && ambBalance && estimatedGas.gt(ambBalance)) {
      return t('bridge.insufficient.funds');
    }

    return t('staking.pool.withdraw');
  }, [ambBalance, amountToWithdraw, deposit, estimatedGas, stake, t, token]);

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
