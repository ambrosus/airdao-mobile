import React, {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Header } from '@components/composite';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicUtils } from '@utils/mnemonics';
import { StringUtils } from '@utils/string';
import { WalletUtils } from '@utils/wallet';
import { Toast, ToastType } from '@components/modular';
import { usePasscodeStore } from '@features/passcode';
import { RenderWords } from '@screens/ImportWalletMethods/screens/ImportWallet/component/RenderWord';
import { useAllAccounts } from '@hooks/database';

const INITIAL_ARRAY = Array(12).fill('');

export const ImportWallet = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { isPasscodeEnabled } = usePasscodeStore();
  const { data: accounts } = useAllAccounts();

  const [mnemonicWords, setMnemonicWords] = useState(INITIAL_ARRAY);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isWalletAlreadyExist, setIsWalletAlreadyExist] = useState(false);

  const inputs = useRef(
    Array(12)
      .fill(null)
      .map(() => React.createRef<InputRef>() as unknown as RefObject<InputRef>)
  );

  useEffect(() => {
    setIsButtonEnabled(mnemonicWords.every((word) => word.trim() !== ''));
  }, [mnemonicWords]);

  const focusNextInput = useCallback(
    (from: number) => {
      if (from === mnemonicWords.length) inputs.current[from]?.current?.blur();
      else inputs.current[from + 1]?.current?.focus();
    },
    [mnemonicWords.length]
  );

  const handleWordChange = useCallback(
    (index: number, text: string) => {
      setError(false);
      const updatedWords = [...mnemonicWords];
      if (text.length >= 2 && text[text.length - 1] == ' ') {
        // focus next input on space
        focusNextInput(index);
      }
      updatedWords[index] = StringUtils.removeNonAlphabeticCharacters(text);
      setMnemonicWords(updatedWords);
    },
    [focusNextInput, mnemonicWords]
  );

  const navigateToSetUpSecurity = useCallback(
    (address: string) => {
      Toast.show({
        text: t('import.wallet.toast.title'),
        subtext: StringUtils.formatAddress(address, 5, 6),
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
    },
    [isPasscodeEnabled, navigation, t]
  );

  const navigateToRestoreWallet = useCallback(async () => {
    setIsWalletAlreadyExist(false);
    if (isButtonEnabled) {
      setError(false);
      setIsLoading(true);
      try {
        const mnemonicPhrase = mnemonicWords.join(' ');
        if (!MnemonicUtils.isValidMnemonic(mnemonicPhrase)) {
          setError(true);
          setIsLoading(false);
          return;
        }

        const wallet = await WalletUtils.processWallet(
          mnemonicPhrase,
          accounts
        );

        navigateToSetUpSecurity(wallet?.address ?? '');
      } catch (error) {
        if ((error as { message: string }).message.includes('400')) {
          setIsWalletAlreadyExist(true);
        } else {
          setIsWalletAlreadyExist(false);
          Alert.alert(
            'Error',
            // @ts-ignore
            error.message || 'An error occurred while importing the wallet.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [isButtonEnabled, mnemonicWords, accounts, navigateToSetUpSecurity]);

  const buttonTitle = useMemo(() => {
    return isLoading ? 'button.importing.wallet' : 'button.confirm';
  }, [isLoading]);

  const buttonDisabled = useMemo(() => {
    return error || isLoading || !isButtonEnabled;
  }, [error, isButtonEnabled, isLoading]);

  return (
    <SafeAreaView style={styles.main}>
      <Header
        bottomBorder
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={20}
            color={COLORS.neutral800}
          >
            {t('import.wallet.methods.mnemonic')}
          </Text>
        }
        titlePosition="center"
        style={styles.headerShadow}
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          extraHeight={verticalScale(180)}
          enableOnAndroid
          enableAutomaticScroll
          scrollToOverflowEnabled={false}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
        >
          <KeyboardDismissingView style={styles.container}>
            <View style={styles.descriptionWrapper}>
              <Text
                color={COLORS.neutral800}
                fontFamily="Inter_400Regular"
                fontSize={15}
                align="center"
                style={styles.description}
              >
                {t('import.wallet.phrase.description')}
              </Text>
              <RenderWords
                inputs={inputs}
                mnemonicWords={mnemonicWords}
                handleWordChange={handleWordChange}
                focusNextInput={focusNextInput}
                navigateToRestoreWallet={navigateToRestoreWallet}
              />
              <Spacer value={verticalScale(16)} />
            </View>
            {error && (
              <Text
                fontFamily="Inter_400Regular"
                fontSize={15}
                color={COLORS.error600}
                style={styles.error}
              >
                {t('import.wallet.error')}
              </Text>
            )}
          </KeyboardDismissingView>
        </KeyboardAwareScrollView>

        {!!isWalletAlreadyExist && (
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.error600}
            style={styles.footerErrorMessage}
          >
            {t('import.wallet.key.error.exist')}
          </Text>
        )}

        <Button
          disabled={buttonDisabled}
          onPress={navigateToRestoreWallet}
          type="circular"
          style={{
            ...styles.button,
            backgroundColor: !buttonDisabled ? COLORS.brand600 : COLORS.brand100
          }}
        >
          {isLoading && (
            <>
              <Spinner />
              <Spacer horizontal value={scale(10)} />
            </>
          )}
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={!buttonDisabled ? COLORS.neutral0 : COLORS.brand400}
            style={styles.buttonText}
          >
            {t(`${buttonTitle}`)}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
