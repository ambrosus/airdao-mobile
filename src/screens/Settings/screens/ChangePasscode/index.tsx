import React, { useEffect, useState } from 'react';
import { Button, Spacer, Text } from '@components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloseIcon } from '@components/svg/icons';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@utils/scaling';
import { Passcode } from '@components/base/Passcode/Passcode';
import { Alert } from 'react-native';
import { SettingsTabNavigationProp } from '@appTypes';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import usePasscode from '@contexts/Passcode';
import { useTranslation } from 'react-i18next';
import database from '@database/Database';

export const ChangePasscode = () => {
  const { t } = useTranslation();
  const { savedPasscode, setSavedPasscode } = usePasscode();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const [step, setStep] = useState<number>(1);
  const [newPasscode, setNewPasscode] = useState<string[]>([]);

  const onBackPress = async () => {
    navigation.navigate('SecuritySettings');
  };

  useEffect(() => {
    Promise.all([database.localStorage.get('Passcode')]).then(
      ([passcodeRes]) => {
        setSavedPasscode(passcodeRes as string[]);
      }
    );
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
          setSavedPasscode(typedPasscode);
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
    <SafeAreaView>
      <Spacer value={verticalScale(24)} />
      <Button onPress={onBackPress} style={{ paddingHorizontal: scale(16.5) }}>
        <CloseIcon scale={1.3} />
      </Button>
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
    </SafeAreaView>
  );
};
