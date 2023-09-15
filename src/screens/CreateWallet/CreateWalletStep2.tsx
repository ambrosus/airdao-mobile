import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { useAddWalletContext } from '@contexts';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from '@screens/CreateWallet/styles';
import { WalletUtils } from '@utils/wallet';
import { HomeNavigationProp } from '@appTypes';

export const CreateWalletStep2 = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { walletMnemonic } = useAddWalletContext();
  const { t } = useTranslation();
  const [walletMnemonicSelected, setWalletMnemonicSelected] = useState<
    string[]
  >([]);
  const [loading] = useState<boolean>(false);
  const [isMnemonicCorrect, setIsMnemonicCorrect] = useState<boolean>(false);

  const walletMnemonicArrayDefault = walletMnemonic.split(' ');
  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );

  const validateMnemonicOrder = () => {
    setIsMnemonicCorrect(
      JSON.stringify(walletMnemonicSelected) ===
        JSON.stringify(walletMnemonicArrayDefault)
    );
  };

  const numColumns = Math.ceil(walletMnemonicArrayDefault.length / 4);

  let globalWordIndex = 0;

  const renderWord = useMemo(
    () => (word: string, flow: 'inner' | 'mnemonic') => {
      globalWordIndex++;
      const selectedIdx = walletMnemonicSelected.indexOf(word);
      const isCorrect =
        walletMnemonicArrayDefault.indexOf(word) === selectedIdx;

      const onPress = () => {
        if (selectedIdx > -1) {
          walletMnemonicSelected.splice(selectedIdx, 1);
        } else {
          walletMnemonicSelected.push(word);
        }
        setWalletMnemonicSelected([...walletMnemonicSelected]);
        validateMnemonicOrder();
      };

      const buttonTextColorInner =
        selectedIdx !== -1 ? '#A1A6B2' : COLORS.neutral800;

      const buttonTextColorMnemonic = isCorrect
        ? COLORS.success400
        : walletMnemonicSelected.includes(word)
        ? COLORS.error400
        : COLORS.neutral800;

      let countDisplay = null;

      if (flow === 'mnemonic' && selectedIdx !== -1) {
        countDisplay = (
          <Text
            align="center"
            fontFamily="Inter_600SemiBold"
            fontSize={12}
            color={COLORS.neutral800}
            key={`count-display-${globalWordIndex}`}
          >
            {globalWordIndex}.
          </Text>
        );
      }

      return (
        <React.Fragment key={`word-${globalWordIndex}`}>
          <Button
            key={word}
            style={{
              backgroundColor:
                selectedIdx !== -1 && flow === 'mnemonic'
                  ? 'transparent'
                  : COLORS.neutral100,
              borderRadius: 48,
              width: scale(98)
            }}
            onPress={onPress}
            disabled={selectedIdx !== -1 && flow === 'inner'}
          >
            <Text
              align="center"
              fontFamily="Inter_600SemiBold"
              fontSize={12}
              color={
                flow === 'mnemonic'
                  ? buttonTextColorMnemonic
                  : buttonTextColorInner
              }
              style={{ marginHorizontal: scale(15), marginVertical: scale(8) }}
            >
              {countDisplay} {''}
              {word}
            </Text>
          </Button>
          <Spacer value={verticalScale(20)} />
        </React.Fragment>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicSelected, walletMnemonicArrayDefault]
  );

  const handleVerifyPress = useCallback(async () => {
    if (walletMnemonicSelected.length !== walletMnemonicArrayDefault.length) {
      return;
    }
    const isMnemonicValid =
      JSON.stringify(walletMnemonicSelected) ===
      JSON.stringify(walletMnemonicArrayDefault);

    const isOrderCorrect = walletMnemonicSelected.every(
      (word, index) => word === walletMnemonicArrayDefault[index]
    );

    if (!isMnemonicValid && !isOrderCorrect) {
      return;
    }

    try {
      await WalletUtils.processWallet(walletMnemonic);
      navigation.navigate('SuccessBackupComplete');
    } catch (error) {
      // TODO ignore
    }
  }, [
    navigation,
    walletMnemonic,
    walletMnemonicArrayDefault,
    walletMnemonicSelected
  ]);

  return (
    <SafeAreaView edges={['top']} style={styles.createWalletStep2Container}>
      <Header />
      <Text
        align="center"
        fontSize={24}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral800}
      >
        {t('double.check')}
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        align="center"
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral800}
      >
        {t('tap.words.in.correct.order')}
      </Text>
      <Spacer value={verticalScale(24)} />
      <View style={styles.mnemoicContainer}>
        {Array.isArray(walletMnemonicSelected) && (
          <Row style={styles.words}>
            {Array.from({ length: numColumns }, (_, columnIndex) => (
              <View key={columnIndex} style={styles.mnemoicContainerColumn}>
                {walletMnemonicSelected
                  .slice(columnIndex * 4, (columnIndex + 1) * 4)
                  .map((word) => renderWord(word, 'mnemonic'))}
              </View>
            ))}
          </Row>
        )}
      </View>
      <Spacer value={verticalScale(24)} />
      {loading && <Spinner size="large" />}
      <View style={styles.innerContainer}>
        <Spacer value={verticalScale(36)} />
        {Array.isArray(walletMnemonicRandomSorted) && (
          <Row style={styles.words}>
            {Array.from({ length: numColumns }, (_, columnIndex) => (
              <View key={columnIndex} style={styles.column}>
                {walletMnemonicRandomSorted
                  .slice(columnIndex * 4, (columnIndex + 1) * 4)
                  .map((word) => renderWord(word, 'inner'))}
              </View>
            ))}
          </Row>
        )}
        <Spacer value={verticalScale(12)} />
      </View>
      <Button
        disabled={!isMnemonicCorrect}
        onPress={handleVerifyPress}
        type="circular"
        style={{
          backgroundColor: isMnemonicCorrect
            ? COLORS.brand600
            : COLORS.alphaBlack5,
          marginBottom: scale(44),
          width: '90%',
          alignSelf: 'center'
        }}
      >
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={isMnemonicCorrect ? COLORS.neutral0 : COLORS.neutral600}
          style={{ marginVertical: scale(12) }}
        >
          {t('verify.btn')}
        </Text>
      </Button>
    </SafeAreaView>
  );
};
