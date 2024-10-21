import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Passcode } from '@components/modular';
import { Spacer, Text, Button } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { isIos } from '@utils/isPlatform';

const KEYBOARD_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = isIos
  ? 'padding'
  : 'height';

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
      behavior={KEYBOARD_BEHAVIOR}
      style={{ top, flex: 1, justifyContent: 'space-between' }}
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

        <Spacer value={scale(23)} />
        <View style={{ paddingHorizontal: scale(16) }}>
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
