import { useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { BottomSheet, TextOrSpinner } from '@components/composite';
import { SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { SuccessTxView } from '@entities/harbor/components/base';
import { IAvailableWithdrawLogs, LogStatus } from '@entities/harbor/types';
import { useWalletStore } from '@entities/wallet';
import { useWithdrawalActions } from '@features/harbor/lib/hooks';
import { useContainerStyleWithSafeArea } from '@hooks';
import { _delayNavigation } from '@utils';
import { styles } from './styles';

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
  const { t } = useTranslation();
  const navigation = useNavigation<HarborNavigationProp>();
  const { wallet } = useWalletStore();
  const { hbrYieldFetcher } = useStakeHBRStore();

  const bottomSheetContainerStyle = useContainerStyleWithSafeArea(
    styles.bottomSheetContainer
  );

  const { deposit, stake } = useStakeHBRStore();
  const {
    loading,
    timestamp,
    transaction,
    bottomSheetRef,
    withdrawalCallback
  } = useWithdrawalActions(token, amountToWithdraw);

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

  const dismiss = useCallback(
    () => bottomSheetRef.current?.dismiss(),
    [bottomSheetRef]
  );

  const onDismissBottomSheet = useCallback(async () => {
    try {
      await hbrYieldFetcher(wallet?.address ?? '');
      _delayNavigation(dismiss, () => navigation.goBack());
    } catch (error) {
      throw error;
    }
  }, [dismiss, hbrYieldFetcher, navigation, wallet?.address]);

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
        onPress={withdrawalCallback}
      >
        <TextOrSpinner
          label={label}
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
        />
      </SecondaryButton>

      <BottomSheet
        ref={bottomSheetRef}
        swiperIconVisible={false}
        closeOnBackPress={!loading}
        swipingEnabled={!loading}
        onBackdropPress={onDismissBottomSheet}
      >
        <View style={bottomSheetContainerStyle}>
          <SuccessTxView
            withdraw
            token={token}
            sender={false}
            timestamp={timestamp}
            amount={amountToWithdraw}
            txHash={transaction?.transactionHash}
            dismiss={dismiss}
          />
        </View>
      </BottomSheet>
    </>
  );
};
