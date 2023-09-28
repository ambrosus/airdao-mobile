import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer, Text, Button, KeyboardDismissingView } from '@components/base';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeNavigationProp, HomeParamsList } from '@appTypes';
import { useTranslation } from 'react-i18next';
import { Passcode } from '@components/base/Passcode/Passcode';
import { database } from '@database/main';

export const ConfirmPasscode = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList, 'ConfirmPasscode'>>();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const { passcode: originalPasscode } = route.params;
  const isButtonEnabled = passcode.join('').length === 4;

  const onContinuePress = async () => {
    if (passcode.join('') === originalPasscode.join('')) {
      await database.localStorage.set('Passcode', passcode);
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
      enabled
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
          Confirm passcode
        </Text>
        <Spacer value={verticalScale(8)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          Re-enter your passcode to secure your wallet
        </Text>
        <Spacer value={verticalScale(106)} />
        <Passcode onPasscodeChange={onPasscodeChange} autoFocus={true} />
        <Spacer value={verticalScale(50)} />
      </View>
      <KeyboardDismissingView style={{ paddingHorizontal: scale(16) }}>
        <Button
          disabled={!isButtonEnabled}
          onPress={onContinuePress}
          type="circular"
          style={{
            backgroundColor: isButtonEnabled
              ? COLORS.brand500
              : COLORS.alphaBlack5,
            marginBottom: verticalScale(48)
          }}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={isButtonEnabled ? COLORS.neutral0 : COLORS.neutral600}
            style={{ marginVertical: scale(12) }}
          >
            {t('continue.btn')}
          </Text>
        </Button>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
