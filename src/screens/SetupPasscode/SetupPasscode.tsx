import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Passcode } from '@components/modular';
import { Spacer, Text, Button } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { DeviceUtils } from '@utils/device';

export const SetupPasscode = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
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
    <KeyboardAvoidingView
      enabled={DeviceUtils.isIOS}
      behavior="padding"
      style={{ top, flex: 1, justifyContent: 'space-between' }}
    >
      <View style={{ paddingHorizontal: scale(16) }}>
        <Spacer value={verticalScale(47)} />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('security.enter.passcode')}
        </Text>
        <Spacer value={verticalScale(8)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('security.enter.passcode.text')}
        </Text>
        <Spacer value={verticalScale(106)} />
        <Passcode onPasscodeChange={onPasscodeChange} />
        <Spacer value={verticalScale(33)} />
        <View style={{ paddingHorizontal: scale(70) }}>
          <Text
            align="center"
            fontSize={14}
            fontFamily="Inter_400Regular"
            color="#676B73"
          >
            {t('security.enter.passcode.hint')}
          </Text>
        </View>
        <Spacer value={verticalScale(30)} />
      </View>
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
    </KeyboardAvoidingView>
  );
};
