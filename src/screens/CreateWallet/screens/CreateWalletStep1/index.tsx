import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer, Spinner, Text } from '@components/base';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { MnemonicUtils } from '@utils/mnemonics';
import { useAddWalletContext } from '@contexts';
import { verticalScale, scale } from '@utils/scaling';
import { PrimaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@constants/colors';
import { WarningIcon } from '@components/svg/icons/Warning';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';

export const CreateWalletStep1 = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [loading, setLoading] = useState(false);
  const { walletMnemonic, mnemonicLength, setWalletMnemonic } =
    useAddWalletContext();
  const walletMnemonicArray = walletMnemonic.split(' ');
  const { t } = useTranslation();

  const init = async () => {
    setLoading(true);
    // create mnemonic
    // tslint:disable-next-line:no-shadowed-variable
    const walletMnemonic = (
      await MnemonicUtils.generateNewMnemonic(mnemonicLength)
    ).mnemonic;
    setWalletMnemonic(walletMnemonic);
    setLoading(false);
  };

  useEffect(() => {
    if (mnemonicLength > 0) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonicLength]);

  const renderWord = (word: string, index: number) => {
    return (
      <View style={styles.mnemonic} key={index}>
        <Text
          color={COLORS.neutral400}
          fontSize={14}
          fontFamily="Inter_600SemiBold"
        >
          {index + 1}
        </Text>
        <Spacer value={scale(8)} horizontal />
        <Text
          align="center"
          fontFamily="Inter_600SemiBold"
          fontSize={14}
          color={COLORS.neutral900}
        >
          {word}
        </Text>
      </View>
    );
  };

  const onNextPress = () => {
    navigation.navigate('CreateWalletStep2');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header style={{ shadowColor: 'transparent' }} />
      <Text
        align="center"
        fontSize={24}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral900}
      >
        {t('create.wallet.your.recovery.phrase')}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        align="center"
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
      >
        {t('create.wallet.verify.text')}
      </Text>
      {loading && (
        <View style={styles.loading}>
          <Spinner size="large" />
        </View>
      )}
      <Spacer value={verticalScale(40)} />
      <View style={styles.innerContainer}>
        <View style={styles.mnemonicsContainer}>
          {Array.isArray(walletMnemonicArray) &&
            walletMnemonicArray.map(renderWord)}
        </View>
        <View>
          <View style={styles.warningContainer}>
            <View style={styles.warning}>
              <WarningIcon />
              <Spacer horizontal value={scale(12)} />
              <Text>{t('create.wallet.verification.alert')}</Text>
            </View>
          </View>
          <Spacer value={verticalScale(34)} />
          <BottomAwareSafeAreaView paddingBottom={verticalScale(18)}>
            <PrimaryButton onPress={onNextPress}>
              <Text color={COLORS.neutral0}>
                {t('create.wallet.verify.phrase')}
              </Text>
            </PrimaryButton>
          </BottomAwareSafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(16)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    flex: 1
  },
  warningContainer: {
    backgroundColor: COLORS.warning100,
    borderRadius: 13,
    borderWidth: 0.2,
    borderColor: COLORS.warning400
  },
  warning: {
    marginVertical: scale(12),
    marginHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center'
  },
  mnemonicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: verticalScale(24),
    width: scale(314),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scale(16)
  },
  mnemonic: {
    width: scale(94),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderRadius: 1000,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    height: verticalScale(36),
    minHeight: 36
  }
});
