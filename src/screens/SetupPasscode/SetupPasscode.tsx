import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { SettingsTabNavigationProp } from '@appTypes';
import { Passcode } from '@components/modular';

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
    <SafeAreaView
      style={{
        paddingTop: verticalScale(15),
        flex: 1,
        justifyContent: 'space-between'
      }}
    >
      <View>
        <View
          style={{ borderBottomWidth: 2, borderBottomColor: COLORS.neutral100 }}
        >
          <Spacer value={verticalScale(23)} />
          <Text
            align="center"
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            {t('security.enter.passcode')}
          </Text>
          <Spacer value={scale(19)} />
        </View>
        <Spacer value={scale(19)} />
        <View style={{ paddingHorizontal: scale(16) }}>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            {t('security.enter.passcode.text')}
          </Text>
        </View>
      </View>
      <View>
        <Passcode
          isBiometricEnabled={false}
          onPasscodeChange={onPasscodeChange}
        />
        <Spacer value={scale(19)} />
        <BottomAwareSafeAreaView style={{ paddingHorizontal: scale(16) }}>
          <Button
            disabled={!isButtonEnabled}
            onPress={onContinuePress}
            type="circular"
            style={{
              backgroundColor: isButtonEnabled
                ? COLORS.brand500
                : COLORS.alphaBlack5,
              marginBottom: verticalScale(24)
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={isButtonEnabled ? COLORS.neutral0 : COLORS.neutral600}
              style={{ marginVertical: scale(12) }}
            >
              {t('button.continue')}
            </Text>
          </Button>
        </BottomAwareSafeAreaView>
      </View>
    </SafeAreaView>
  );
};
