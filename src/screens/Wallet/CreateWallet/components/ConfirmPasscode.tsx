import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer, Text, Button, KeyboardDismissingView } from '@components/base';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeNavigationProp, HomeParamsList } from '@appTypes';
import { useTranslation } from 'react-i18next';
import { Passcode } from '@components/base/Passcode/Passcode';

export const ConfirmPasscode = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeParamsList, 'ConfirmPasscode'>>();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const { passcode: originalPasscode } = route.params;
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    setIsButtonEnabled(passcode.length === 4);
  }, [passcode]);

  const onContinuePress = async () => {
    if (passcode.join('') === originalPasscode.join('')) {
      navigation.navigate('SuccessSetupSecurity');
    } else {
      Alert.alert('Password dont match');
    }
  };

  // tslint:disable-next-line:no-shadowed-variable
  const onPasscodeChange = (passcode: string[]) => {
    setPasscode(passcode);
  };

  // TODO save passcode to localdb

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
          color={COLORS.nero}
        >
          Confirm passcode
        </Text>
        <Spacer value={verticalScale(8)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          Re-enter your passcode to secure your wallet
        </Text>
        <Spacer value={verticalScale(106)} />
        <Passcode onPasscodeChange={onPasscodeChange} />
        <Spacer value={verticalScale(50)} />
      </View>
      <KeyboardDismissingView style={{ paddingHorizontal: scale(16) }}>
        <Button
          disabled={!isButtonEnabled}
          onPress={onContinuePress}
          type="circular"
          style={{
            backgroundColor: isButtonEnabled
              ? COLORS.mainBlue
              : COLORS.neutralGray,
            marginBottom: verticalScale(48)
          }}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={isButtonEnabled ? COLORS.white : COLORS.neutral600}
            style={{ marginVertical: scale(12) }}
          >
            {t('continue.btn')}
          </Text>
        </Button>
      </KeyboardDismissingView>
    </KeyboardAvoidingView>
  );
};
