import React, { useEffect, useState } from 'react';
import { Button, Spacer, Text } from '@components/base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon } from '@components/svg/icons';
import { useNavigation } from '@react-navigation/native';
import { verticalScale } from '@utils/scaling';
import { Alert, View } from 'react-native';
import { SettingsTabNavigationProp } from '@appTypes';
import { Passcode, Toast, ToastPosition, ToastType } from '@components/modular';
import usePasscode from '@contexts/Passcode';
import { useTranslation } from 'react-i18next';
import { PasscodeUtils } from '@utils/passcode';
import { Header } from '@components/composite';

export const ChangePasscode = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { savedPasscode, setSavedPasscode } = usePasscode();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const [step, setStep] = useState<number>(1);
  const [newPasscode, setNewPasscode] = useState<string[]>([]);

  const onBackPress = async () => {
    navigation.navigate('SecuritySettings');
  };

  useEffect(() => {
    PasscodeUtils.getPasscodeFromDB().then((passcodeRes) => {
      setSavedPasscode(passcodeRes);
    });
  }, [setSavedPasscode]);

  const handlePasscode = async (typedPasscode: string[]) => {
    if (typedPasscode.length === 4) {
      if (step === 1) {
        // Step 1: Check user passcode
        if (JSON.stringify(savedPasscode) === JSON.stringify(typedPasscode)) {
          setStep(2);
        } else {
          Alert.alert(t('passcode.doesnt.match'), t('please.try.again'), [
            {
              text: t('try.again'),
              onPress: () => null,
              style: 'cancel'
            }
          ]);
        }
      } else if (step === 2) {
        // Step 2: Type new user passcode
        setNewPasscode(typedPasscode);
        setStep(3);
      } else if (step === 3) {
        // Step 3: Confirm new user passcode
        if (JSON.stringify(newPasscode) === JSON.stringify(typedPasscode)) {
          await PasscodeUtils.setPasscodeInDB(typedPasscode);
          navigation.navigate('SecuritySettings');
          Toast.show({
            text: t('passcode.changed'),
            position: ToastPosition.Top,
            type: ToastType.Success
          });
        } else {
          Alert.alert(t('passcode.doesnt.match'), t('please.try.again'), [
            {
              text: t('try.again'),
              onPress: () => null,
              style: 'cancel'
            }
          ]);
        }
      }
    }
  };

  return (
    <View style={{ top }}>
      <Header
        contentLeft={
          <Button onPress={onBackPress}>
            <CloseIcon scale={1.3} />
          </Button>
        }
        backIconVisible={false}
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={verticalScale(160)} />
      <Text align="center" fontFamily="Inter_700Bold" fontSize={24}>
        {step === 1
          ? t('enter.your.passcode')
          : step === 2
          ? t('enter.new.passcode')
          : t('confirm.new.passcode')}
      </Text>
      <Spacer value={verticalScale(24)} />
      <Passcode
        onPasscodeChange={handlePasscode}
        autoFocus={true}
        type="change"
      />
    </View>
  );
};