import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Text } from '@components/base';
import { Header } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { useStakeHBRStore } from '@entities/harbor';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';
import { StakeInput } from '@features/harbor/components/modular';
import { NumberUtils } from '@utils';
import { styles } from './styles';

export const StakeHBRScreen = () => {
  const { t } = useTranslation();
  const { deposit } = useStakeHBRStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Stake HBR" />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={8}
        style={styles.justifyContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <StakedBalanceInfo
              title={t('harbor.staked.balance')}
              stakedValue={NumberUtils.numberToTransformedLocale(
                NumberUtils.limitDecimalCount(
                  +ethers.utils.formatEther(deposit),
                  2
                )
              )}
              coin={CryptoCurrencyCode.HBR}
            />

            <StakeInput
              description="Your AMB staking limit depends on the amount of HBR staked. Stake more
          HBR to increase your limit!"
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.footer}>
          <PrimaryButton onPress={() => null}>
            <Text>Approve HBR</Text>
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
