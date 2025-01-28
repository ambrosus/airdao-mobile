import {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  createRef
} from 'react';
import {
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { Header } from '@components/composite';
import { Toast, ToastType } from '@components/modular';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';
import { useAllAccounts } from '@hooks/database';
import { RenderWords } from '@screens/ImportWalletMethods/screens/ImportWallet/component/RenderWord';
import {
  WalletUtils,
  StringUtils,
  MnemonicUtils,
  scale,
  verticalScale,
  isAndroid,
  isSmallScreen
} from '@utils';
import { styles } from './styles';

const INITIAL_ARRAY = Array(12).fill('');

const EXTRA_SCROLL_HEIGHT = Platform.select({
  ios: 180,
  android: isSmallScreen ? 240 : 180,
  default: 180
});

const EXTRA_HEIGHT = isSmallScreen ? 64 : 0;

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
  const [scrollOffset, setScrollOffset] = useState(0);

  const keyboardAwareScrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const onScrollHandle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const inputs = useRef(
    Array(12)
      .fill(null)
      .map(() => createRef<InputRef>() as unknown as RefObject<InputRef>)
  );

  useEffect(() => {
    setIsButtonEnabled(mnemonicWords.every((word) => word.trim() !== ''));
  }, [mnemonicWords]);

  const focusNextInput = useCallback(
    (from: number) => {
      if (from === mnemonicWords.length) inputs.current[from]?.current?.blur();
      else {
        if (isAndroid && from >= 7) {
          keyboardAwareScrollViewRef.current?.scrollToPosition(
            0,
            scrollOffset + 100,
            true
          );
        }

        inputs.current[from + 1]?.current?.focus();
      }
    },
    [mnemonicWords.length, scrollOffset]
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
          ref={keyboardAwareScrollViewRef}
          onScroll={onScrollHandle}
          extraScrollHeight={verticalScale(EXTRA_HEIGHT)}
          extraHeight={verticalScale(EXTRA_SCROLL_HEIGHT)}
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
