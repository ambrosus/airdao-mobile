import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { BottomSheetRef, Header } from '@components/composite';
import {
  Button,
  KeyboardDismissingView,
  Row,
  Spacer,
  Text
} from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { LeadEyeEmptyMiddleIcon, LeadEyeOffIcon } from '@components/svg/icons';
import { PrimaryButton, PrivateKeyMaskedInput } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BottomSheetImportWalletPrivateKeyStatus } from '@components/templates';

type ImportWalletStatuses = 'initial' | 'pending' | 'success';

export const ImportWalletPrivateKey = () => {
  const [status, setStatus] = useState<ImportWalletStatuses>('initial');

  const bottomSheetProcessingRef = useRef<BottomSheetRef>(null);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [privateKey, setPrivateKey] = useState('');

  const onImportWalletPress = async () => {
    setStatus('success');
    try {
      // await WalletUtils.importWalletViaPrivateKey(privateKey);
    } catch (error) {
      setStatus('initial');
      throw error;
    }
  };

  useEffect(() => {
    if (status === 'success' && !bottomSheetProcessingRef.current?.isVisible) {
      bottomSheetProcessingRef.current?.show();
    }
  }, [status]);

  const disabled = useMemo(() => {
    const isWrongLengthOrEmpty = privateKey === '' || privateKey.length !== 64;
    return {
      state: isWrongLengthOrEmpty,
      typographyColor: isWrongLengthOrEmpty
        ? COLORS.neutral400
        : COLORS.neutral0
    };
  }, [privateKey]);

  const toggleSecureTextEntry = () =>
    setSecureTextEntry((prevState) => !prevState);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        titleStyle={styles.titleStyle}
        title="Import wallet"
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
                  Enter your private key
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
                    {secureTextEntry ? 'Show' : 'Hide'} private key
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
                Hello world
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
