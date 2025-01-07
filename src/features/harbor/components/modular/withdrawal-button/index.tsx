import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';
import { BottomSheet, TextOrSpinner } from '@components/composite';
import { SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useStakeHBRStore } from '@entities/harbor';
import { SuccessTxView } from '@entities/harbor/components/base';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';
import { useWithdrawalActions } from '@features/harbor/lib/hooks';
import { useContainerStyleWithSafeArea } from '@hooks';
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

  const onDismissBottomSheet = () => bottomSheetRef.current?.dismiss();

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

      <BottomSheet
        ref={bottomSheetRef}
        swiperIconVisible={false}
        swipingEnabled={false}
      >
        <View style={bottomSheetContainerStyle}>
          <SuccessTxView
            withdraw
            token={token}
            sender={false}
            timestamp={timestamp}
            amount={amountToWithdraw}
            txHash={transaction?.transactionHash}
            dismiss={onDismissBottomSheet}
          />
        </View>
      </BottomSheet>
    </>
  );
};
