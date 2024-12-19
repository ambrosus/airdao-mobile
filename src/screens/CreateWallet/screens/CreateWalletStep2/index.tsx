import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView, Header } from '@components/composite';
import { Button, Row, Spacer, Text, Spinner } from '@components/base';
import { scale, verticalScale, WalletUtils } from '@utils';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicRandom } from './MnemonicRandom';
import { MnemonicSelected } from './MnemonicSelected';
import { styles } from './Step2.styles';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { usePasscodeStore } from '@features/passcode';
import { useAddWalletStore } from '@features/add-wallet';

export const CreateWalletStep2 = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { mnemonic } = useAddWalletStore();
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

  const walletMnemonicArrayDefault = mnemonic
    .split(' ')
    .map((word, index) => ({ word, index }));

  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()), // sort not-in-place
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );

  const isMnemonicCorrect = useMemo(
    () => walletMnemonicSelectedWordsOnly.join(' ') === mnemonic,
    [mnemonic, walletMnemonicSelectedWordsOnly]
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
      navigation.navigate('Tabs', {
        screen: 'Settings',
        // @ts-ignore
        params: { screen: 'SetupPasscode' }
      });
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
      await WalletUtils.processWallet(mnemonic);
      navigateToSetUpSecurity();
    } finally {
      setLoading(false);
    }
  }, [
    isMnemonicCorrect,
    navigateToSetUpSecurity,
    mnemonic,
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

  const isDisabledButton = useMemo(
    () => !isMnemonicCorrect || loading,
    [isMnemonicCorrect, loading]
  );

  return (
    <SafeAreaView style={styles.main}>
      <Header
        style={styles.header}
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
                {t('create.wallet.recovery.phrase.error')}
              </Text>
              <Spacer value={20} />
            </>
          )}
          <Button
            disabled={isDisabledButton}
            onPress={handleVerifyPress}
            type="circular"
            style={{
              backgroundColor: !isDisabledButton
                ? COLORS.brand600
                : COLORS.brand100,
              ...styles.button
            }}
          >
            {loading && (
              <Row>
                <Spinner />
                <Spacer horizontal value={10} />
              </Row>
            )}
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={!isDisabledButton ? COLORS.neutral0 : COLORS.brand400}
            >
              {loading ? t('button.verifying') : t('button.verify')}
            </Text>
          </Button>
        </BottomAwareSafeAreaView>
      </View>
    </SafeAreaView>
  );
};
