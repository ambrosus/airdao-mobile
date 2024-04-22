import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  BottomAwareSafeAreaView,
  BottomSheetRef,
  CheckBox,
  Header
} from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { RecoveryPhraseModal } from '@screens/CreateWallet/components';
import { styles } from '@screens/CreateWallet/styles';
import { stylesStep0 } from './Step0.styles';
import { MnemonicIcon } from '@components/svg/icons';
import { HomeNavigationProp } from '@appTypes';

export const CreateWalletStep0 = () => {
  const [selected, setSelected] = useState<boolean>(false);
  const navigation = useNavigation<HomeNavigationProp>();
  const recoveryPhraseModalRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const onContinuePress = () => {
    navigation.navigate('CreateWalletStep1');
  };

  const showRecoveryModal = useCallback(() => {
    recoveryPhraseModalRef.current?.show();
  }, [recoveryPhraseModalRef]);

  return (
    <SafeAreaView style={stylesStep0.flexStyle}>
      <Header
        titlePosition="center"
        bottomBorder
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={scale(18)}
            color={COLORS.neutral800}
          >
            {t('create.wallet.backup.header')}
          </Text>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={scale(23)} />
      <BottomAwareSafeAreaView style={styles.container}>
        <View style={stylesStep0.flexStyle}>
          <View>
            <Text
              align="center"
              fontSize={scale(16)}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {t('create.wallet.backup.text')}{' '}
              <Text
                align="center"
                onPress={showRecoveryModal}
                fontSize={scale(15)}
                fontFamily="Inter_500Medium"
                color={COLORS.brand600}
                style={{ textDecorationLine: 'underline' }}
              >
                {t('create.wallet.backup.popup')}
              </Text>
              <Text
                align="center"
                fontSize={scale(15)}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {' '}
                {t('create.wallet.prepare')}
              </Text>
            </Text>
          </View>
          <Spacer value={verticalScale(80)} />
          <View style={styles.mnemoicLogo}>
            <MnemonicIcon />
          </View>
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
              backgroundColor: selected ? COLORS.brand600 : COLORS.alphaBlack5
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={selected ? COLORS.neutral0 : COLORS.neutral600}
              style={stylesStep0.buttonTextStyle}
            >
              {t('button.continue')}
            </Text>
          </Button>
        </View>
        <RecoveryPhraseModal ref={recoveryPhraseModalRef} />
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
