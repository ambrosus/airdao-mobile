import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Alert,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  View
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { Spacer, Text, Button } from '@components/base';
import { Passcode } from '@components/modular';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp, HomeParamsList } from '@appTypes';
import { scale, verticalScale } from '@utils/scaling';
import usePasscode from '@contexts/Passcode';
import { isIos } from '@utils/isPlatform';

const KEYBOARD_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = isIos
  ? 'padding'
  : 'height';

export const ConfirmPasscode = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList, 'ConfirmPasscode'>>();
  const { top } = useSafeAreaInsets();
  const { setSavedPasscode } = usePasscode();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const { passcode: originalPasscode } = route.params;
  const isButtonEnabled = passcode.join('').length === 4;

  const onContinuePress = async () => {
    if (passcode.join('') === originalPasscode.join('')) {
      setSavedPasscode(passcode);
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
    <KeyboardAvoidingView
      behavior={KEYBOARD_BEHAVIOR}
      style={{ top, flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <View
          style={{ borderBottomWidth: 2, borderBottomColor: COLORS.neutral100 }}
        >
          <Spacer value={verticalScale(23)} />
          <View style={{ paddingHorizontal: scale(16) }}>
            <Text
              align="center"
              fontSize={24}
              fontFamily="Inter_700Bold"
              color={COLORS.neutral800}
            >
              {t('security.confirm.passcode.text')}
            </Text>
          </View>
          <Spacer value={verticalScale(19)} />
        </View>
        <Spacer value={verticalScale(23)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('security.confirm.passcode.description')}
        </Text>
        <Spacer value={verticalScale(106)} />
        <Passcode onPasscodeChange={onPasscodeChange} />
        <Spacer value={verticalScale(50)} />
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
