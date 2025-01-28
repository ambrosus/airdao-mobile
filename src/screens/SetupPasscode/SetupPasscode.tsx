import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsTabNavigationProp } from '@appTypes';
import { Button, Text } from '@components/base';
import { Header } from '@components/composite';
import { Passcode } from '@components/modular';
import { COLORS } from '@constants/colors';
import { DEVICE_HEIGHT } from '@constants/variables';
import { styles } from './SetupPasscode.styles';

export const SetupPasscode = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const isButtonEnabled = passcode.join('').length === 4;
  const { top } = useSafeAreaInsets();
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

  useEffect(() => {
    const onBackPress = () => true;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ ...styles.main, paddingTop: top }}>
      <View>
        <Header
          bottomBorder
          backIconVisible={false}
          title={t('security.enter.passcode')}
        />
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
      </View>
      <View>
        <Passcode
          inputBottomPadding={DEVICE_HEIGHT * 0.1}
          isBiometricEnabled={false}
          onPasscodeChange={onPasscodeChange}
        />
        <View style={styles.buttonWrapper}>
          <Button
            disabled={!isButtonEnabled}
            onPress={onContinuePress}
            type="circular"
            style={{
              ...styles.button,
              backgroundColor: isButtonEnabled
                ? COLORS.brand500
                : COLORS.brand100
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={isButtonEnabled ? COLORS.neutral0 : COLORS.brand300}
              style={styles.buttonText}
            >
              {t('button.confirm')}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
