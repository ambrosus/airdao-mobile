import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsTabNavigationProp } from '@appTypes';
import { Button, Row, Spacer, Text } from '@components/base';
import {
  BottomAwareSafeAreaView,
  CheckBox,
  Header
} from '@components/composite';
import { NewWalletPageIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/CreateWallet/styles';
import { scale, verticalScale } from '@utils';
import { stylesStep0 } from './Step0.styles';

export const CreateWalletStep0 = () => {
  const { params } = useRoute();

  const [selected, setSelected] = useState<boolean>(false);
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const { t } = useTranslation();

  const onContinuePress = () => {
    navigation.navigate('CreateWalletStep1');
  };

  const onBackPress = () => {
    // @ts-ignore
    if (params?.from === 'WelcomeScreen') {
      navigation.navigate('WelcomeScreen');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={stylesStep0.flexStyle}>
      <Header
        titlePosition="center"
        bottomBorder
        onBackPress={onBackPress}
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={scale(18)}
            color={COLORS.neutral800}
          >
            {t('button.create.wallet')}
          </Text>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={scale(23)} />
      <BottomAwareSafeAreaView style={styles.container}>
        <View style={stylesStep0.flexStyle}>
          <Text
            fontSize={scale(15)}
            fontFamily="Inter_400Regular"
            fontWeight="normal"
            color={COLORS.neutral800}
          >
            {t('create.wallet.backup.text')}
          </Text>
          <Spacer value={verticalScale(80)} />
          <NewWalletPageIcon />
        </View>
        <View style={stylesStep0.container}>
          <Row alignItems="center">
            <CheckBox
              fillColor={COLORS.sapphireBlue}
              color={COLORS.neutral0}
              type="square"
              onValueChange={setSelected}
              value={selected}
            />
            <Spacer horizontal value={scale(12)} />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
              style={stylesStep0.createText}
            >
              {t('create.wallet.checkbox.text')}
            </Text>
          </Row>
          <Spacer value={verticalScale(32)} />
          <Button
            disabled={!selected}
            onPress={onContinuePress}
            type="circular"
            style={{
              height: verticalScale(50),
              backgroundColor: selected ? COLORS.brand600 : COLORS.alphaBlack5
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={selected ? COLORS.neutral0 : COLORS.brand500}
              style={stylesStep0.buttonTextStyle}
            >
              {t('button.continue')}
            </Text>
          </Button>
        </View>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
