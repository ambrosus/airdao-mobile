import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header, InputWithIcon } from '@components/composite';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { WalletUtils } from '@utils/wallet';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicUtils } from '@utils/mnemonics';
import { StringUtils } from '@utils/string';
import { styles } from './styles';

export const RestoreWalletScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();

  const [mnemonicWords, setMnemonicWords] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef(
    Array(12)
      .fill(null)
      .map(() => React.createRef<InputRef>() as unknown as RefObject<InputRef>)
  );

  useEffect(() => {
    setIsButtonEnabled(mnemonicWords.every((word) => word.trim() !== ''));
  }, [mnemonicWords]);

  const focusNextInput = (from: number) => {
    if (from === 11) inputs.current[from]?.current?.blur();
    else inputs.current[from + 1]?.current?.focus();
  };

  const handleWordChange = (index: number, text: string) => {
    const updatedWords = [...mnemonicWords];
    if (text.length >= 2 && text[text.length - 1] == ' ') {
      // focus next input on space
      focusNextInput(index);
    }
    updatedWords[index] = StringUtils.removeNonAlphabeticCharacters(text);
    setMnemonicWords(updatedWords);
  };

  // TODO simplify in the future
  const renderWords = () => {
    const wordInputs = [];
    for (let i = 0; i < 12; i += 2) {
      wordInputs.push(
        <Row
          key={i}
          alignItems="center"
          justifyContent="space-between"
          style={{
            marginBottom: verticalScale(16),
            columnGap: scale(16)
          }}
        >
          <View
            style={{
              flex: 1,
              width: '100%'
            }}
          >
            <InputWithIcon
              ref={inputs.current[i]}
              value={mnemonicWords[i]}
              type="text"
              returnKeyType="next"
              autoCapitalize="none"
              iconLeft={
                <Text
                  fontSize={16}
                  fontFamily="Inter_400Regular"
                  color={
                    mnemonicWords[i] !== ''
                      ? COLORS.neutral900
                      : COLORS.alphaBlack60
                  }
                >
                  {i + 1}.{' '}
                </Text>
              }
              spacingLeft={0}
              spacingRight={0}
              onChangeText={(text) => handleWordChange(i, text)}
              onSubmitEditing={() => focusNextInput(i)}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: '100%'
            }}
          >
            <InputWithIcon
              ref={inputs.current[i + 1]}
              value={mnemonicWords[i + 1]}
              type="text"
              autoCapitalize="none"
              returnKeyType={i === 10 ? 'done' : 'next'}
              iconLeft={
                <Text
                  fontSize={16}
                  fontFamily="Inter_400Regular"
                  color={
                    mnemonicWords[i + 1] !== ''
                      ? COLORS.neutral900
                      : COLORS.alphaBlack60
                  }
                >
                  {i + 2}.{' '}
                </Text>
              }
              spacingLeft={0}
              spacingRight={0}
              onChangeText={(text) => handleWordChange(i + 1, text)}
              onSubmitEditing={() =>
                i === 10 ? navigateToRestoreWallet() : focusNextInput(i + 1)
              }
            />
          </View>
        </Row>
      );
    }

    return wordInputs;
  };

  const navigateToRestoreWallet = async () => {
    if (isButtonEnabled) {
      setIsLoading(true);
      try {
        const mnemonicPhrase = mnemonicWords.join(' ');
        if (!MnemonicUtils.isValidMnemonic(mnemonicPhrase)) {
          Alert.alert('Invalid mnemonic phrase');
        } else {
          await WalletUtils.processWallet(mnemonicPhrase);
          navigation.navigate('SuccessImport');
        }
      } catch (error) {
        // TODO add localization
        Alert.alert(
          'Error',
          // @ts-ignore
          error.message || 'An error occurred while importing the wallet.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text
            align="center"
            fontSize={20}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            {t('restore.wallet.loading')}
          </Text>
          <Spacer value={verticalScale(24)} />
          <Spinner />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <KeyboardDismissingView style={{ flex: 1 }}>
            <Header
              title={
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={16}
                  color={COLORS.neutral800}
                >
                  {t('restore.wallet.header')}
                </Text>
              }
              titlePosition="left"
              style={{ shadowColor: 'transparent' }}
            />
            <KeyboardAwareScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between'
              }}
            >
              <View>
                <Spacer value={verticalScale(16)} />
                <Text
                  align="center"
                  fontFamily="Inter_700Bold"
                  fontSize={24}
                  color={COLORS.neutral800}
                >
                  {t('restore.wallet.title')}
                </Text>
                <Spacer value={verticalScale(8)} />
                <View style={{ paddingHorizontal: scale(16) }}>
                  <Text
                    color={COLORS.neutral800}
                    fontFamily="Inter_500Medium"
                    fontSize={15}
                    style={{ textAlign: 'center' }}
                  >
                    {t('restore.wallet.description')}
                  </Text>
                  <Spacer value={verticalScale(16)} />
                  {renderWords()}
                  <Spacer value={verticalScale(16)} />
                </View>
              </View>
              <Button
                disabled={!isButtonEnabled}
                onPress={navigateToRestoreWallet}
                type="circular"
                style={{
                  marginTop: verticalScale(16),
                  bottom: verticalScale(32),
                  marginHorizontal: scale(16),
                  backgroundColor: isButtonEnabled
                    ? COLORS.brand600
                    : COLORS.alphaBlack5
                }}
              >
                <Text
                  fontSize={16}
                  fontFamily="Inter_600SemiBold"
                  color={isButtonEnabled ? COLORS.neutral0 : COLORS.neutral600}
                  style={{ marginVertical: scale(12) }}
                >
                  {t('continue.btn')}
                </Text>
              </Button>
            </KeyboardAwareScrollView>
          </KeyboardDismissingView>
        </View>
      )}
    </SafeAreaView>
  );
};
