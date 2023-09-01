import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetRef, CheckBox, Header } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { useNavigation } from '@react-navigation/native';
import { RecoveryPhraseModal } from '@screens/Wallet/CreateWallet/components/RecoveryPhraseModal';
import { styles } from '@screens/Wallet/CreateWallet/styles';
import { AddWalletStackNavigationProp } from '@appTypes/navigation/add-wallet';
import { useTranslation } from 'react-i18next';
import { MnemoicIcon } from '@components/svg/icons';

export const CreateWalletStep0 = () => {
  const { top } = useSafeAreaInsets();
  const [selected, setSelected] = useState<boolean>(false);
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const recoveryPhraseModalRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const onContinuePress = () => {
    navigation.navigate('CreateWalletStep1');
  };

  const showRecoveryModal = useCallback(() => {
    recoveryPhraseModalRef.current?.show();
  }, [recoveryPhraseModalRef]);

  return (
    <View style={[{ top }, styles.container]}>
      <View>
        <Header
          titlePosition="left"
          title={
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.nero}
            >
              {t('create.new.wallet')}
            </Text>
          }
          style={styles.header}
        />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.nero}
        >
          {t('backup.your.wallet')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <View style={{ flexDirection: 'row' }}>
          <Text
            align="center"
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.nero}
          >
            {t('backup.wallet.text')}{' '}
          </Text>
          <Button onPress={showRecoveryModal}>
            <Text
              align="center"
              fontSize={15}
              fontFamily="Inter_500Medium"
              color={COLORS.blue600}
              style={{ textDecorationLine: 'underline' }}
            >
              {t('backup.wallet.popup')}
            </Text>
          </Button>
        </View>
        <Text
          align="center"
          fontSize={15}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          {t('make.sure.to.write.down')}
        </Text>
        <Spacer value={verticalScale(64)} />
        <View style={styles.mnemoicLogo}>
          <MnemoicIcon />
        </View>
      </View>
      <View style={{ marginBottom: verticalScale(120) }}>
        <Row>
          <CheckBox
            fillColor={COLORS.sapphireBlue}
            color={COLORS.white}
            type="square"
            onValueChange={setSelected}
            value={selected}
          />
          <Spacer horizontal value={scale(12)} />
          <Text fontSize={15} fontFamily="Inter_500Medium" color={COLORS.nero}>
            {t('checkbox.text')}
          </Text>
        </Row>
        <Spacer value={verticalScale(32)} />
        <Button
          disabled={!selected}
          onPress={onContinuePress}
          type="circular"
          style={{
            backgroundColor: selected ? COLORS.mainBlue : COLORS.neutralGray
          }}
        >
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={selected ? COLORS.white : COLORS.neutral600}
            style={{ marginVertical: scale(12) }}
          >
            {t('continue.btn')}
          </Text>
        </Button>
      </View>
      <RecoveryPhraseModal ref={recoveryPhraseModalRef} />
    </View>
  );
};
