import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer, Text, Button, KeyboardDismissingView } from '@components/base';
import { KeyboardAvoidingView, View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { useTranslation } from 'react-i18next';
import { Passcode } from '@components/base/Passcode/Passcode';

export const SetupPasscode = () => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    setIsButtonEnabled(passcode.length === 4);
  }, [passcode]);

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
      enabled
      behavior="padding"
      style={{
        top,
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 48
      }}
    >
      <View style={{ paddingHorizontal: scale(16) }}>
        <Spacer value={verticalScale(47)} />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.nero}
        >
          Enter Passcode
        </Text>
        <Spacer value={verticalScale(8)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          Passcode will be required for wallet access and transactions.
        </Text>
        <Spacer value={verticalScale(106)} />
        {/* TODO work on input */}
        <Passcode onPasscodeChange={onPasscodeChange} />
        <Spacer value={verticalScale(33)} />
        <View style={{ paddingHorizontal: scale(70) }}>
          <Text
            align="center"
            fontSize={14}
            fontFamily="Inter_400Regular"
            color="#676B73"
          >
            Use a PIN you will remember. {'\n'} It cannot be recovered.
          </Text>
        </View>
        <Spacer value={verticalScale(30)} />
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
