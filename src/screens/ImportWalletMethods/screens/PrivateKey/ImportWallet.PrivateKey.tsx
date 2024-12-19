import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  InteractionManager,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  View
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { Header } from '@components/composite';
import { PrivateKeyMaskedInput, Toast, ToastType } from '@components/modular';
import { LeadEyeEmptyMiddleIcon, LeadEyeOffIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';
import { useAllAccounts } from '@hooks/database';
import {
  StringUtils,
  isIos,
  scale,
  verticalScale,
  delay,
  WalletUtils
} from '@utils';
import { styles } from './styles';

const KEYBOARD_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = isIos
  ? 'padding'
  : 'height';

export const ImportWalletPrivateKey = () => {
  const { t } = useTranslation();
  const { data: accounts } = useAllAccounts();
  const { isPasscodeEnabled } = usePasscodeStore();

  const maskedInputRef = useRef<InputRef>(null);
  const navigation: HomeNavigationProp = useNavigation();
  const [loader, setLoader] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [privateKey, setPrivateKey] = useState('');
  const [errorStatus, setErrorStatus] = useState('');

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

  const onImportWalletPress = useCallback(async () => {
    setLoader(true);
    maskedInputRef.current?.blur();

    try {
      const wallet = await WalletUtils.importWalletViaPrivateKey(
        privateKey,
        accounts
      );
      await delay(1200);
      navigateToSetUpSecurity(wallet?.address || '');
    } catch (error) {
      // @ts-ignore
      const errorStatus = error.message.includes('400') ? 'exist' : 'unknown';

      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(async () => {
          setErrorStatus(errorStatus);
        });
      });
    } finally {
      setLoader(false);
    }
  }, [accounts, navigateToSetUpSecurity, privateKey]);

  const privateKeySetter = (value: string) => {
    setErrorStatus('');
    setPrivateKey(value);
  };

  const disabled = useMemo(() => {
    const isEmpty = privateKey === '';
    return {
      state: isEmpty,
      typographyColor: isEmpty || loader ? COLORS.brand600 : COLORS.neutral0
    };
  }, [loader, privateKey]);

  const toggleSecureTextEntry = useCallback(() => {
    setSecureTextEntry((prevState) => !prevState);
  }, []);

  const errorText = useMemo(() => {
    const alreadyExistError = t('import.wallet.key.error.exist');
    const importError = t('import.private.key.error');
    return errorStatus === 'exist' ? alreadyExistError : importError;
  }, [errorStatus, t]);

  const disabledButton = useMemo(() => {
    return loader || disabled.state || !!errorStatus;
  }, [disabled.state, errorStatus, loader]);

  const buttonText = useMemo(() => {
    return loader ? t('button.importing.wallet') : t('button.confirm');
  }, [loader, t]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        titleStyle={styles.titleStyle}
        title={t('import.wallet.key')}
      />
      <Text
        color={COLORS.neutral800}
        fontFamily="Inter_400Regular"
        fontSize={15}
        align="center"
        style={styles.description}
      >
        {t('import.wallet.key.description')}
      </Text>

      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={isIos ? 20 : 0}
        behavior={KEYBOARD_BEHAVIOR}
      >
        <KeyboardDismissingView style={styles.container}>
          <View style={styles.innerContainer}>
            <View>
              <View>
                <Text
                  fontSize={16}
                  fontFamily="Inter_500Medium"
                  color={
                    secureTextEntry ? COLORS.neutral600 : COLORS.neutral900
                  }
                >
                  {t('import.wallet.key.input.label')}
                </Text>
                <Spacer value={verticalScale(8)} />
                <PrivateKeyMaskedInput
                  color={COLORS.neutral600}
                  ref={maskedInputRef}
                  value={privateKey}
                  setPrivateKey={privateKeySetter}
                  secureTextEntry={secureTextEntry}
                />
              </View>
              <Spacer value={scale(16)} />
              <Button onPress={toggleSecureTextEntry}>
                <Row style={styles.toggleVisibilityRow} alignItems="center">
                  {secureTextEntry ? (
                    <LeadEyeEmptyMiddleIcon color={COLORS.neutral600} />
                  ) : (
                    <LeadEyeOffIcon color={COLORS.neutral600} />
                  )}
                  <Text
                    fontSize={16}
                    fontFamily="Inter_500Medium"
                    color={COLORS.neutral800}
                  >
                    {secureTextEntry
                      ? t('import.wallet.key.show')
                      : t('import.wallet.key.hide')}
                  </Text>
                </Row>
              </Button>
            </View>
            <View style={styles.footer}>
              {!!errorStatus && (
                <Text
                  fontSize={15}
                  fontFamily="Inter_500Medium"
                  color={COLORS.error600}
                >
                  {errorText}
                </Text>
              )}
              <Spacer value={25} />
              <Button
                disabled={disabledButton}
                onPress={onImportWalletPress}
                type="circular"
                style={{
                  ...styles.button,
                  backgroundColor: !disabledButton
                    ? COLORS.brand600
                    : COLORS.brand100
                }}
              >
                {loader && (
                  <>
                    <Spinner />
                    <Spacer value={scale(10)} horizontal />
                  </>
                )}
                <Text
                  fontSize={16}
                  fontFamily="Inter_500Medium"
                  color={disabled.typographyColor}
                >
                  {buttonText}
                </Text>
              </Button>
            </View>
          </View>
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
