import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { KeyboardDismissingView, Spacer } from '@components/base';
import { Header } from '@components/composite';
import {
  SettingsSlippageToleranceForm,
  SettingsDeadlineForm,
  SettingsExpertModeForm,
  SettingsMultiHopForm
} from '@features/swap/components/composite';
import { scale } from '@utils';

export const SwapSettingsScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder title={t('tab.settings')} />
      <KeyboardDismissingView>
        <View style={styles.innerContainer}>
          <Spacer value={scale(16)} />
          <SettingsSlippageToleranceForm />
          <SettingsDeadlineForm />
          <View style={styles.switches}>
            <SettingsExpertModeForm />
            <SettingsMultiHopForm />
          </View>
        </View>
      </KeyboardDismissingView>
    </SafeAreaView>
  );
};
