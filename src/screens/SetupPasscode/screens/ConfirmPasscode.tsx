import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { Passcode } from '@components/modular';
import { COLORS } from '@constants/colors';
import { HomeParamsList, SettingsTabNavigationProp } from '@appTypes';
import { scale, verticalScale } from '@utils/scaling';
import { usePasscodeStore } from '@features/passcode';
import { PasscodeUtils } from '@utils/passcode';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../SetupPasscode.styles';

export const ConfirmPasscode = () => {
  const { top } = useSafeAreaInsets();

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
    <View style={{ ...styles.main, paddingTop: top }}>
      <View>
        <Header bottomBorder title={t('security.enter.passcode')} />
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
        <View style={styles.buttonWrapper}>
          <Button
            disabled={!isButtonEnabled}
            onPress={onContinuePress}
            type="circular"
            style={{
              backgroundColor: isButtonEnabled
                ? COLORS.brand500
                : COLORS.brand100,
              ...styles.button
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
        </View>
      </View>
    </View>
  );
};
