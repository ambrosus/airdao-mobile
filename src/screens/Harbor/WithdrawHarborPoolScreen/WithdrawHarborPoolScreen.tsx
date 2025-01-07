import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Header } from '@components/composite';
import { useAvailableWithdrawLogs, useStakeHBRStore } from '@entities/harbor';
import { WithdrawalHbrYieldInput } from '@entities/harbor/components/modular';
import { LogStatus } from '@entities/harbor/types';
import { CountdownTimer } from '@features/harbor/components/composite';
import { WithdrawalButton } from '@features/harbor/components/modular';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { NumberUtils } from '@utils';
import { styles } from './styles';

type Props = NativeStackScreenProps<
  HarborTabParamsList,
  'WithdrawHarborPoolScreen'
>;

export const WithdrawHarborPoolScreen = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const {
    params: { token, logs }
  } = route;

  const { stake, limitsConfig } = useStakeHBRStore();

  const { logs: stateLogs, refetchLogs } = useAvailableWithdrawLogs(
    limitsConfig.stakeLockPeriod
  );

  const [amountToWithdraw, setAmountToWithdraw] = useState(
    token === CryptoCurrencyCode.AMB && logs?.status === LogStatus.ERROR
      ? NumberUtils.limitDecimalCount(ethers.utils.formatEther(stake), 2)
      : ''
  );

  const refetchLogsHandle = useCallback(() => {
    new Promise<void>((resolve) => {
      refetchLogs();
      resolve();
    }).then(() => {
      navigation.setParams({ logs: stateLogs });
    });
  }, [navigation, refetchLogs, stateLogs]);

  const onChangeAmountToWithdraw = useCallback((amount: string) => {
    setAmountToWithdraw(amount);
  }, []);

  const footerStyle = useKeyboardContainerStyleWithSafeArea(styles.footer);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`${t('harbor.withdraw.header')} ${token}`} />

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={keyboardAvoidingViewOffsetWithNotchSupportedValue(
          8
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.justifyContentContainer}>
              <WithdrawalHbrYieldInput
                value={amountToWithdraw}
                onChangeValue={onChangeAmountToWithdraw}
                token={token}
                type={logs?.status ?? LogStatus.ERROR}
                logs={logs}
              />

              <View style={footerStyle}>
                {logs?.status === LogStatus.ERROR && (
                  <CountdownTimer
                    timestamp={logs?.timestamp ?? 1}
                    refetch={refetchLogsHandle}
                  />
                )}

                <WithdrawalButton
                  logs={logs}
                  token={token}
                  amountToWithdraw={amountToWithdraw}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
