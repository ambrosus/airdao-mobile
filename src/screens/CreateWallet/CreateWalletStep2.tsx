import React, { useCallback, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
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
    { word: string; index: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const walletMnemonicSelectedWordsOnly = walletMnemonicSelected.map(
    ({ word }) => word
  );

  const walletMnemonicArrayDefault = walletMnemonic
    .split(' ')
    .map((word, index) => ({ word, index }));

  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()), // sort not-in-place
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );

  const isMnemonicCorrect = useMemo(
    () => walletMnemonicSelectedWordsOnly.join(' ') === walletMnemonic,
    [walletMnemonic, walletMnemonicSelectedWordsOnly]
  );

  const numColumns = Math.ceil(walletMnemonicArrayDefault.length / 4);

  let globalWordIndex = 0;

  const renderWord = useMemo(
    () =>
      (word: { word: string; index: number }, flow: 'inner' | 'mnemonic') => {
        globalWordIndex++;
        // compare words by content and their index in the original array, required for the cases when duplicate words occur in mnemonics
        const selectedIdx = walletMnemonicSelected.findIndex(
          ({ word: _word, index }) => _word === word.word && index == word.index
        );
        const isCorrect =
          selectedIdx == -1
            ? false
            : walletMnemonicArrayDefault[selectedIdx].word == word.word;

        const onPress = () => {
          if (selectedIdx > -1) {
            walletMnemonicSelected.splice(selectedIdx, 1);
          } else {
            walletMnemonicSelected.push(word);
          }
          setWalletMnemonicSelected([...walletMnemonicSelected]);
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
              key={word.word}
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
                style={{
                  marginHorizontal: scale(15),
                  marginVertical: scale(8)
                }}
              >
                {countDisplay} {''}
                {word.word}
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
    if (!isMnemonicCorrect) {
      return;
    }

    try {
      setLoading(true);
      await WalletUtils.processWallet(walletMnemonic);
      navigation.navigate('SuccessBackupComplete');
    } catch (error) {
      // TODO translate
      Alert.alert('Error occured', 'Could not create wallet!');
    } finally {
      setLoading(false);
    }
  }, [
    isMnemonicCorrect,
    navigation,
    walletMnemonic,
    walletMnemonicArrayDefault.length,
    walletMnemonicSelected.length
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
        disabled={!isMnemonicCorrect || loading}
        onPress={handleVerifyPress}
        type="circular"
        style={{
          backgroundColor: isMnemonicCorrect
            ? COLORS.brand600
            : COLORS.alphaBlack5,
          marginBottom: scale(44),
          width: '90%',
          alignSelf: 'center',
          paddingVertical: verticalScale(12)
        }}
      >
        {loading ? (
          <Spinner color={COLORS.neutral600} />
        ) : (
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={isMnemonicCorrect ? COLORS.neutral0 : COLORS.neutral600}
          >
            {t('verify.btn')}
          </Text>
        )}
      </Button>
    </SafeAreaView>
  );
};
