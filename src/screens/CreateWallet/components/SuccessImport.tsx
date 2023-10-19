import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { PrimaryButton } from '@components/modular';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SuccessIcon } from '@components/svg/icons';
import { HomeNavigationProp } from '@appTypes';
import { PasscodeUtils } from '@utils/passcode';
import { BottomAwareSafeAreaView } from '@components/composite';

export const SuccessImport = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);

  useEffect(() => {
    PasscodeUtils.getPasscodeFromDB().then((passcodeRes) => {
      setIsPasscodeEnabled(!!passcodeRes);
    });
  }, []);

  const navigateToSetUpSecurity = () => {
    if (isPasscodeEnabled) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }]
        })
      );
    } else {
      navigation.navigate('SetupPasscode');
    }
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
          {t('import.successful')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('import.successful.text')}
        </Text>
      </View>
      <BottomAwareSafeAreaView paddingBottom={verticalScale(26)}>
        <PrimaryButton onPress={navigateToSetUpSecurity}>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral0}
          >
            {isPasscodeEnabled
              ? t('start.using.wallet.btn')
              : t('setup.security.btn')}
          </Text>
        </PrimaryButton>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(24)
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
