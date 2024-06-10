import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { HomeNavigationProp } from '@appTypes';
import {
  BottomAwareSafeAreaView,
  BottomSheetRef,
  Header
} from '@components/composite';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Text
} from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { WalletUtils } from '@utils/wallet';
import { COLORS } from '@constants/colors';
import { LeadEyeEmptyMiddleIcon, LeadEyeOffIcon } from '@components/svg/icons';
import { PrimaryButton, PrivateKeyMaskedInput } from '@components/modular';
import { BottomSheetImportWalletPrivateKeyStatus } from '@components/templates';
import { isIos } from '@utils/isPlatform';

enum IMPORT_PROCESS_STATUS {
  INITIAL = 'initial',
  SUCCESS = 'success',
  PENDING = 'pending'
}
const KEYBOARD_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = isIos
  ? 'padding'
  : 'height';

export const ImportWalletPrivateKey = () => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
  const [status, setStatus] = useState<IMPORT_PROCESS_STATUS>(
    IMPORT_PROCESS_STATUS.PENDING
  );

  const bottomSheetProcessingRef = useRef<BottomSheetRef>(null);
  const maskedInputRef = useRef<InputRef>(null);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [privateKey, setPrivateKey] = useState('');

  const onImportWalletPress = useCallback(async () => {
    maskedInputRef.current?.blur();
    bottomSheetProcessingRef.current?.show();
    setStatus(IMPORT_PROCESS_STATUS.PENDING);

    try {
      await WalletUtils.importWalletViaPrivateKey(privateKey);
      setStatus(IMPORT_PROCESS_STATUS.SUCCESS);
    } catch (error) {
      // @ts-ignore
      const errorMessage = error?.message || 'unknown';
      const errorStatus = errorMessage.includes('400') ? 'exist' : 'unknown';

      setTimeout(() => {
        bottomSheetProcessingRef.current?.dismiss();

        navigation.navigate('ImportWalletPrivateKeyError', {
          error: errorStatus
        });
      }, 500);

      setStatus(IMPORT_PROCESS_STATUS.PENDING);
    }
  }, [navigation, privateKey]);

  const disabled = useMemo(() => {
    const isWrongLengthOrEmpty = privateKey === '' || privateKey.length !== 64;
    return {
      state: isWrongLengthOrEmpty,
      typographyColor: isWrongLengthOrEmpty
        ? COLORS.neutral400
        : COLORS.neutral0
    };
  }, [privateKey]);

  const toggleSecureTextEntry = useCallback(() => {
    setSecureTextEntry((prevState) => !prevState);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        titleStyle={styles.titleStyle}
        title={t('import.wallet.common.title')}
      />
      <Spacer value={scale(16)} />

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
                  color={COLORS.neutral600}
                >
                  {t('import.wallet.key.input.label')}
                </Text>
                <Spacer value={verticalScale(8)} />
                <PrivateKeyMaskedInput
                  ref={maskedInputRef}
                  value={privateKey}
                  setPrivateKey={setPrivateKey}
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
            <BottomAwareSafeAreaView paddingBottom={verticalScale(24)}>
              <PrimaryButton
                disabled={disabled.state}
                onPress={onImportWalletPress}
              >
                <Text
                  fontSize={16}
                  fontFamily="Inter_500Medium"
                  color={disabled.typographyColor}
                >
                  {t('button.continue')}
                </Text>
              </PrimaryButton>
            </BottomAwareSafeAreaView>
          </View>
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
      <BottomSheetImportWalletPrivateKeyStatus
        ref={bottomSheetProcessingRef}
        status={status}
      />
    </SafeAreaView>
  );
};
