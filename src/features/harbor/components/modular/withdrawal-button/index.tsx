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
        return (
          bnAmountToWithdraw.isZero() ||
          deposit.isZero() ||
          !stake.isZero() ||
          (logs ? isErrorLog : false)
        );
      }
      case CryptoCurrencyCode.AMB: {
        return (
          bnAmountToWithdraw.isZero() ||
          stake.isZero() ||
          (logs ? isErrorLog : false)
        );
      }
    }
  }, [amountToWithdraw, deposit, logs, stake, token]);

  const buttonStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      backgroundColor: COLORS[disabled ? 'alphaBlack5' : 'brand600']
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

  return (
    <>
      <SecondaryButton
        style={buttonStyle}
        disabled={disabled || loading}
        onPress={withdrawalCallback}
      >
        <TextOrSpinner
          label={t('staking.pool.withdraw')}
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
