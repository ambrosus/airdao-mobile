import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Spacer, Spinner, Text } from '@components/base';
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
      <React.Fragment key={index}>
        <Row
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor: COLORS.neutral100,
            borderRadius: 48,
            width: scale(102),
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(8),
            flex: 1
          }}
        >
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
        </Row>
        <Spacer value={verticalScale(20)} key={`spacer-${index}`} />
      </React.Fragment>
    );
  };

  const onNextPress = () => {
    navigation.navigate('CreateWalletStep2');
  };

  const wordsPerColumn = 4;
  const numColumns = Math.ceil(walletMnemonicArray.length / wordsPerColumn);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header style={{ shadowColor: 'transparent' }} />
      <Text
        align="center"
        fontSize={24}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral900}
      >
        {t('your.recovery.phrase')}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        align="center"
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
      >
        {t('verify.text')}
      </Text>
      {loading && (
        <View style={styles.loading}>
          <Spinner size="large" />
        </View>
      )}
      <Spacer value={verticalScale(40)} />
      <View style={styles.innerContainer}>
        {Array.isArray(walletMnemonicArray) && (
          <Row flex={1} style={{ columnGap: scale(16) }}>
            {Array.from({ length: numColumns }, (_, columnIndex) => (
              <View style={styles.column} key={columnIndex}>
                {walletMnemonicArray
                  .slice(
                    columnIndex * wordsPerColumn,
                    (columnIndex + 1) * wordsPerColumn
                  )
                  .map((word, idx) =>
                    renderWord(word, idx + columnIndex * wordsPerColumn)
                  )}
              </View>
            ))}
          </Row>
        )}
        <View style={styles.warningContainer}>
          <View style={styles.warning}>
            <WarningIcon />
            <Spacer horizontal value={scale(12)} />
            <Text>{t('verification.alert')}</Text>
          </View>
        </View>
        <Spacer value={verticalScale(34)} />
        <BottomAwareSafeAreaView paddingBottom={verticalScale(18)}>
          <PrimaryButton onPress={onNextPress}>
            <Text color={COLORS.neutral0}>{t('verify.phrase')}</Text>
          </PrimaryButton>
        </BottomAwareSafeAreaView>
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
  }
});
