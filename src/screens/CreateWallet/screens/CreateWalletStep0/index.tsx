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
import { RecoveryPhraseModal } from '../../components/RecoveryPhraseModal';
import { styles } from '@screens/CreateWallet/styles';
import { MnemoicIcon } from '@components/svg/icons';
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
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        titlePosition="left"
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {t('create.new.wallet')}
          </Text>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <BottomAwareSafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text
            align="center"
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            {t('backup.your.wallet')}
          </Text>
          <Spacer value={verticalScale(8)} />
          <View>
            <Text
              align="center"
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {t('backup.wallet.text')}{' '}
              <Text
                align="center"
                onPress={showRecoveryModal}
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.brand600}
                style={{ textDecorationLine: 'underline' }}
              >
                {t('backup.wallet.popup')}
              </Text>
              <Text
                align="center"
                fontSize={15}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                {' '}
                {t('make.sure.to.write.down')}
              </Text>
            </Text>
          </View>
          <Spacer value={verticalScale(80)} />
          <View style={styles.mnemoicLogo}>
            <MnemoicIcon />
          </View>
        </View>
        <View
          style={{
            // marginBottom: verticalScale(120),
            width: '100%'
          }}
        >
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
              style={{ maxWidth: scale(330) }}
            >
              {t('checkbox.text')}
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
              style={{ marginVertical: scale(12) }}
            >
              {t('continue.btn')}
            </Text>
          </Button>
        </View>
        <RecoveryPhraseModal ref={recoveryPhraseModalRef} />
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
