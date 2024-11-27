import React, { useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { Passcode } from '@components/modular';
import { COLORS } from '@constants/colors';
import { HomeParamsList, SettingsTabNavigationProp } from '@appTypes';
import { scale, verticalScale } from '@utils/scaling';
import { usePasscodeStore } from '@features/passcode';
import { PasscodeUtils } from '@utils/passcode';

export const ConfirmPasscode = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList>>();
  const { onChangePasscode } = usePasscodeStore();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  // @ts-ignore
  const { passcode: originalPasscode } = route.params;
  const isButtonEnabled = passcode.join('').length === 4;

  const onContinuePress = async () => {
    if (passcode.join('') === originalPasscode.join('')) {
      await PasscodeUtils.setPasscodeInDB(passcode);
      onChangePasscode(passcode);
      navigation.navigate('SuccessSetupSecurity');
    } else {
      Alert.alert('Password dont match');
    }
  };

  // tslint:disable-next-line:no-shadowed-variable
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
          <Header title={t('security.enter.passcode')} />
        </View>
        <Spacer value={verticalScale(20)} />
        <View style={{ paddingHorizontal: 15 }}>
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

      <BottomAwareSafeAreaView style={{ paddingHorizontal: scale(16) }}>
        <Passcode
          isBiometricEnabled={false}
          onPasscodeChange={onPasscodeChange}
        />
        <Spacer value={19} />
        <Button
          disabled={!isButtonEnabled}
          onPress={onContinuePress}
          type="circular"
          style={{
            backgroundColor: isButtonEnabled
              ? COLORS.brand500
              : COLORS.brand100,
            marginBottom: verticalScale(24)
          }}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={isButtonEnabled ? COLORS.neutral0 : COLORS.brand300}
            style={{ marginVertical: scale(12) }}
          >
            {t('button.confirm')}
          </Text>
        </Button>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
