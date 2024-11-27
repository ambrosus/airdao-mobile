import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { SettingsTabNavigationProp } from '@appTypes';
import { Passcode } from '@components/modular';
import { styles } from './SetupPasscode.styles';

export const SetupPasscode = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const isButtonEnabled = passcode.join('').length === 4;
  const onContinuePress = () => {
    if (passcode.every((code) => code !== '')) {
      navigation.navigate('ConfirmPasscode', { passcode });
    } else {
      // TODO
    }
  };

  const onPasscodeChange = (passcode: string[]) => {
    setPasscode(passcode);
  };

  return (
    <SafeAreaView style={styles.main}>
      <View>
        <View style={styles.headerContainer}>
          <Header
            backIconVisible={false}
            title={t('security.enter.passcode')}
          />
        </View>
        <Spacer value={scale(20)} />
        <View style={styles.infoContainer}>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            {t('security.enter.passcode.text')}
          </Text>
        </View>
        <Spacer value={verticalScale(20)} />
      </View>
      <View>
        <Passcode
          isBiometricEnabled={false}
          onPasscodeChange={onPasscodeChange}
        />
        <Spacer value={scale(19)} />
        <BottomAwareSafeAreaView style={styles.buttonWrapper}>
          <Button
            disabled={!isButtonEnabled}
            onPress={onContinuePress}
            type="circular"
            style={{
              ...styles.button,
              backgroundColor: isButtonEnabled
                ? COLORS.brand500
                : COLORS.brand100
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={isButtonEnabled ? COLORS.neutral0 : COLORS.brand300}
              style={styles.buttonText}
            >
              {t('button.confirm')}
            </Text>
          </Button>
        </BottomAwareSafeAreaView>
      </View>
    </SafeAreaView>
  );
};
