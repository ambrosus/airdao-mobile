import { useCallback, useRef, useState } from 'react';
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
import { BottomSheetRef, Header } from '@components/composite';
import { KEYBOARD_OPENING_TIME, bnZERO } from '@constants/variables';
import { useAvailableWithdrawLogs, useStakeHBRStore } from '@entities/harbor';
import { WithdrawalHbrYieldInput } from '@entities/harbor/components/modular';
import { LogStatus } from '@entities/harbor/types';
import { useWalletStore } from '@entities/wallet';
import { useWithdrawalActions } from '@features/harbor';
import { CountdownTimer } from '@features/harbor/components/composite';
import { WithdrawalButton } from '@features/harbor/components/modular';
import { BottomSheetWithdrawTransactionWithAction } from '@features/harbor/components/templates';
import { useAMBEntity } from '@features/send-funds/lib/hooks';
import {
  keyboardAvoidingViewOffsetWithNotchSupportedValue,
  useKeyboardContainerStyleWithSafeArea
} from '@hooks';
import { NumberUtils, estimatedNetworkProviderFee } from '@utils';
import { styles } from './styles';

type Props = NativeStackScreenProps<
  HarborTabParamsList,
  'WithdrawHarborPoolScreen'
>;

export const WithdrawHarborPoolScreen = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const ambInstance = useAMBEntity(wallet?.address ?? '');
  const { stake, deposit, limitsConfig } = useStakeHBRStore();
  const { logs: stateLogs, refetchLogs } = useAvailableWithdrawLogs(
    limitsConfig.stakeLockPeriod
  );

  const {
    params: { token, logs }
  } = route;

  const [loading, setLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<ethers.BigNumber>(bnZERO);

  const withdrawalBottomSheetRef = useRef<BottomSheetRef>(null);

  const [amountToWithdraw, setAmountToWithdraw] = useState(
    token === CryptoCurrencyCode.ASC && logs?.status === LogStatus.ERROR
      ? NumberUtils.limitDecimalCount(ethers.utils.formatEther(stake), 2)
      : ''
  );

  const { withdrawalCallback } = useWithdrawalActions(token, amountToWithdraw);

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

  const onPressMaxButton = useCallback(async () => {
    const txEstimateGas = await withdrawalCallback({ estimateGas: true });
    const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);
    setEstimatedGas(txGasFee);

    onChangeAmountToWithdraw(
      ethers.utils.formatEther(
        token === CryptoCurrencyCode.ASC ? stake : deposit
      )
    );
  }, [deposit, onChangeAmountToWithdraw, stake, token, withdrawalCallback]);

  const onPreviewBottomSheet = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const txEstimateGas = await withdrawalCallback({ estimateGas: true });
      const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);
      setEstimatedGas(txGasFee);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }

    setTimeout(
      () => withdrawalBottomSheetRef.current?.show(),
      KEYBOARD_OPENING_TIME
    );
  }, [withdrawalCallback]);

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
                onPressMaxButton={onPressMaxButton}
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
                  onButtonPress={onPreviewBottomSheet}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <BottomSheetWithdrawTransactionWithAction
        logs={logs}
        token={token}
        amount={amountToWithdraw}
        ref={withdrawalBottomSheetRef}
        estimatedGas={estimatedGas}
        ambBalance={ethers.utils.parseEther(
          ambInstance.balance.formattedBalance
        )}
      />
    </SafeAreaView>
  );
};
