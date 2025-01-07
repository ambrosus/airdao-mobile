import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { Header } from '@components/composite';
import { useStakeHBRStore } from '@entities/harbor';
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

export const WithdrawHarborPoolScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const {
    params: { token, logs }
  } = route;

  const { stake, deposit } = useStakeHBRStore();

  const [amountToWithdraw, setAmountToWithdraw] = useState(
    NumberUtils.limitDecimalCount(
      ethers.utils.formatEther(
        token === CryptoCurrencyCode.AMB ? stake : deposit
      ),
      2
    )
  );

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
                  <CountdownTimer timestamp={logs?.timestamp ?? 1} />
                )}

                <WithdrawalButton token={token} logs={logs} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
