import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spacer, Spinner, Text } from '@components/base';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { useAddWalletContext } from '@contexts';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WalletUtils } from '@utils/wallet';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicRandom } from './MnemonicRandom';
import { MnemonicSelected } from './MnemonicSelected';

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
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'Tabs',
              params: {
                screen: 'Wallets',
                params: { screen: 'HomeScreen' }
              }
            },
            {
              name: 'Tabs',
              params: {
                screen: 'Wallets',
                params: { screen: 'SuccessBackupComplete' }
              }
            }
          ]
        })
      );
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

  const renderSelectedWord = (
    word: { word: string; index: number },
    idx: number
  ) => {
    const selectedIdx = walletMnemonicSelected.findIndex(
      ({ word: _word, index }) => _word === word.word && index == word.index
    );

    const onPress = () => {
      if (selectedIdx > -1) {
        walletMnemonicSelected.splice(selectedIdx, 1);
      } else {
        walletMnemonicSelected.push(word);
      }
      setWalletMnemonicSelected([...walletMnemonicSelected]);
    };

    const isPlacedCorrectly =
      selectedIdx == -1
        ? false
        : walletMnemonicArrayDefault[selectedIdx].word == word.word;
    return (
      <View style={{ width: scale(100) }} key={`${word.index}-${word.word}`}>
        <MnemonicSelected
          word={word.word}
          onPress={onPress}
          isPlacedCorrectly={isPlacedCorrectly}
          index={idx + 1}
        />
      </View>
    );
  };

  const renderRandomWord = (word: { word: string; index: number }) => {
    const selectedIdx = walletMnemonicSelected.findIndex(
      ({ word: _word, index }) => _word === word.word && index == word.index
    );

    const onPress = () => {
      if (selectedIdx > -1) {
        walletMnemonicSelected.splice(selectedIdx, 1);
      } else {
        walletMnemonicSelected.push(word);
      }
      setWalletMnemonicSelected([...walletMnemonicSelected]);
    };
    return (
      <View style={{ width: scale(100) }} key={`${word.index}-${word.word}`}>
        <MnemonicRandom
          word={word.word}
          onPress={onPress}
          selected={selectedIdx > -1}
          disabled={selectedIdx > -1}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header style={{ shadowColor: COLORS.transparent }} />
      <View style={styles.container}>
        <View>
          <Text
            align="center"
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            {t('double.check')}
          </Text>
          <Spacer value={verticalScale(8)} />
          <Text
            align="center"
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral800}
          >
            {t('tap.words.in.correct.order')}
          </Text>
          <Spacer value={verticalScale(24)} />
          <View style={styles.selectedMnemonicContainer}>
            <View style={[styles.mnemoicContainer]}>
              {Array.isArray(walletMnemonicSelected) &&
                walletMnemonicSelected.map(renderSelectedWord)}
            </View>
          </View>
          <Spacer value={verticalScale(24)} />
          <View style={styles.mnemoicContainer}>
            {Array.isArray(walletMnemonicRandomSorted) &&
              walletMnemonicRandomSorted.map(renderRandomWord)}
          </View>
        </View>
        <BottomAwareSafeAreaView>
          <Button
            disabled={!isMnemonicCorrect || loading}
            onPress={handleVerifyPress}
            type="circular"
            style={{
              backgroundColor: isMnemonicCorrect
                ? COLORS.brand600
                : COLORS.alphaBlack5,
              width: '90%',
              alignSelf: 'center',
              paddingVertical: verticalScale(12)
            }}
          >
            {loading ? (
              <Spinner color={COLORS.neutral900} />
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
        </BottomAwareSafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  selectedMnemonicContainer: {
    minHeight: verticalScale(172),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderColor: COLORS.neutral100,
    borderWidth: 2,
    marginHorizontal: scale(16),
    borderRadius: moderateScale(16)
  },
  mnemoicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: verticalScale(20),
    width: scale(342),
    alignSelf: 'center',
    alignItems: 'center',
    columnGap: scale(20)
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
