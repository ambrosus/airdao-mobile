import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  BottomAwareSafeAreaView,
  CenteredSpinner,
  Header
} from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { useAddWalletContext } from '@contexts';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { WalletUtils } from '@utils/wallet';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicRandom } from './MnemonicRandom';
import { MnemonicSelected } from './MnemonicSelected';
import { styles } from './Step2.styles';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { DEVICE_WIDTH } from '@constants/variables';
import { usePasscodeStore } from '@features/passcode';

export const CreateWalletStep2 = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { walletMnemonic } = useAddWalletContext();
  const { t } = useTranslation();
  const { isPasscodeEnabled } = usePasscodeStore();

  const [walletMnemonicSelected, setWalletMnemonicSelected] = useState<
    { word: string; index: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState(false);
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

  const navigateToSetUpSecurity = useCallback(() => {
    Toast.show({
      text: t('toast.wallet.created'),
      position: ToastPosition.Top,
      type: ToastType.Success
    });

    if (isPasscodeEnabled) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Tabs', params: { screen: 'Wallets' } }]
        })
      );
    } else {
      navigation.navigate('SetupPasscode');
    }
  }, [isPasscodeEnabled, navigation, t]);

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
      navigateToSetUpSecurity();
    } finally {
      setLoading(false);
    }
  }, [
    isMnemonicCorrect,
    navigateToSetUpSecurity,
    walletMnemonic,
    walletMnemonicArrayDefault.length,
    walletMnemonicSelected.length
  ]);

  const onPositionIncorrect = () => {
    setCreateError(true);
    setWalletMnemonicSelected([]);
  };

  const renderSelectedWord = (
    word: { word: string; index: number },
    idx: number
  ) => {
    const selectedIdx = walletMnemonicSelected.findIndex(
      ({ word: _word, index }) => _word === word.word && index == word.index
    );

    const onPressOnSelected = () => {
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
    if (!isPlacedCorrectly) {
      onPositionIncorrect();
    }
    return (
      <View style={{ width: scale(100) }} key={`${word.index}-${word.word}`}>
        <MnemonicSelected
          word={word.word}
          onPress={onPressOnSelected}
          index={idx + 1}
        />
      </View>
    );
  };

  const renderRandomWord = (word: { word: string; index: number }) => {
    const selectedIdx = walletMnemonicSelected.findIndex(
      ({ word: _word, index }) => _word === word.word && index == word.index
    );

    const onPressOnRandom = () => {
      if (createError) {
        setCreateError(false);
      }
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
          onPress={onPressOnRandom}
          selected={selectedIdx > -1}
          disabled={selectedIdx > -1}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        style={{
          shadowColor: COLORS.transparent,
          borderBottomWidth: 1,
          borderColor: COLORS.neutral900Alpha['5']
        }}
        title={
          <Text
            align="center"
            fontSize={scale(18)}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            {t('button.create.wallet')}
          </Text>
        }
      />
      <Spacer value={20} />
      <View style={styles.container}>
        <View>
          <Text
            align="center"
            fontSize={scale(16)}
            fontFamily="Inter_400Regular"
            color={COLORS.neutral800}
          >
            {t('create.wallet.tap.words.in.correct.order')}
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
          {createError && (
            <>
              <Text
                color={COLORS.error600}
                fontFamily="Inter_400Regular"
                fontSize={scale(15)}
                style={{ paddingHorizontal: 30 }}
              >
                Verification failed. Tap the words in the correct order to
                continue.
              </Text>
              <Spacer value={20} />
            </>
          )}
          <Button
            disabled={!isMnemonicCorrect || loading}
            onPress={handleVerifyPress}
            type="circular"
            style={{
              position: 'relative',
              height: verticalScale(50),
              backgroundColor: isMnemonicCorrect
                ? COLORS.brand600
                : COLORS.brand100,
              ...styles.button
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={isMnemonicCorrect ? COLORS.neutral0 : COLORS.brand400}
            >
              {loading ? t('button.verifying') : t('button.verify')}
            </Text>
            <Row
              style={{
                left: DEVICE_WIDTH * 0.25,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute'
              }}
            >
              {loading && <CenteredSpinner />}
            </Row>
          </Button>
        </BottomAwareSafeAreaView>
      </View>
    </SafeAreaView>
  );
};
