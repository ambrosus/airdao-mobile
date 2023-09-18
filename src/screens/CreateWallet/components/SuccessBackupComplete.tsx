import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '@components/modular';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SuccessIcon } from '@components/svg/icons';
import { HomeNavigationProp } from '@appTypes';

export const SuccessBackupComplete = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const navigateToSetUpSecurity = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }]
      })
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SuccessIcon />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('backup.complete')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('backup.complete.text')}
        </Text>
      </View>
      <PrimaryButton onPress={navigateToSetUpSecurity}>
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral0}
        >
          {t('setup.security.btn')}
        </Text>
      </PrimaryButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16)
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});