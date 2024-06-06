import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { HomeNavigationProp } from '@appTypes';
import { BottomSheetRef, Header } from '@components/composite';
import {
  Button,
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

enum IMPORT_PROCESS_STATUS {
  INITIAL = 'initial',
  SUCCESS = 'success',
  PENDING = 'pending'
}

function delay(cb: () => void) {
  setTimeout(() => {
    cb();
  }, 500);
}

export const ImportWalletPrivateKey = () => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();
  const [status, setStatus] = useState<IMPORT_PROCESS_STATUS>(
    IMPORT_PROCESS_STATUS.INITIAL
  );

  const bottomSheetProcessingRef = useRef<BottomSheetRef>(null);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [privateKey, setPrivateKey] = useState('');

  const onImportWalletPress = async () => {
    setStatus(IMPORT_PROCESS_STATUS.PENDING);
    bottomSheetProcessingRef.current?.show();
    try {
      const account = await WalletUtils.importWalletViaPrivateKey(privateKey);

      if (!account) {
        Keyboard.dismiss();
        bottomSheetProcessingRef.current?.dismiss();

        delay(() =>
          navigation.navigate('ImportWalletPrivateKeyError', {
            error: 'unknown'
          })
        );
      }

      setStatus(IMPORT_PROCESS_STATUS.SUCCESS);
    } catch (error) {
      Keyboard.dismiss();
      bottomSheetProcessingRef.current?.dismiss();
      delay(() =>
        navigation.navigate('ImportWalletPrivateKeyError', {
          // @ts-ignore
          error: error.message.includes('400') ? 'exist' : 'unknown'
        })
      );
      setStatus(IMPORT_PROCESS_STATUS.INITIAL);
    }
  };

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
        keyboardVerticalOffset={20}
        behavior="padding"
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
