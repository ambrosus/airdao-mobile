import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { Button, Input, Spacer, Spinner, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { WalletUtils } from '@utils/wallet';
import { HomeNavigationProp } from '@appTypes';
import { MnemonicUtils } from '@utils/mnemonics';
import { styles } from './styles';

export const RestoreWalletScreen = () => {
  const { top } = useSafeAreaInsets();
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

  useEffect(() => {
    setIsButtonEnabled(mnemonicWords.every((word) => word.trim() !== ''));
  }, [mnemonicWords]);

  const handleWordChange = (index: number, text: string) => {
    const updatedWords = [...mnemonicWords];
    updatedWords[index] = text;
    setMnemonicWords(updatedWords);
  };

  // TODO simplify in the future
  const renderWords = () => {
    const wordInputs = [];
    for (let i = 0; i < 12; i += 2) {
      wordInputs.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          <Input
            type="text"
            autoCapitalize="none"
            style={{
              flex: 1,
              marginBottom: verticalScale(16)
            }}
            placeholder={`${i + 1}.`}
            placeholderTextColor={COLORS.neutral800}
            onChangeText={(text) => handleWordChange(i, text)}
          />
          <Spacer horizontal value={scale(16)} />
          <Input
            type="text"
            autoCapitalize="none"
            style={{
              flex: 1,
              marginBottom: verticalScale(16)
            }}
            placeholder={`${i + 2}.`}
            placeholderTextColor={COLORS.neutral800}
            onChangeText={(text) => handleWordChange(i + 1, text)}
          />
        </View>
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
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <Text
            align="center"
            fontSize={20}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
          >
            Importing your wallet from {'\n'} backup
          </Text>
          <Spacer value={verticalScale(24)} />
          <Spinner />
        </SafeAreaView>
      ) : (
        <View style={{ flex: 1, top, justifyContent: 'space-between' }}>
          <View>
            <Header
              title={
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={16}
                  color={COLORS.neutral800}
                >
                  Import existing wallet
                </Text>
              }
              titlePosition="left"
              style={{ shadowColor: 'transparent' }}
            />
            <Spacer value={verticalScale(16)} />
            <Text
              align="center"
              fontFamily="Inter_700Bold"
              fontSize={24}
              color={COLORS.neutral800}
            >
              Enter recovery phrase
            </Text>
            <Spacer value={verticalScale(8)} />
            <View style={{ paddingHorizontal: scale(16) }}>
              <Text
                color={COLORS.neutral800}
                fontFamily="Inter_500Medium"
                fontSize={15}
                style={{ textAlign: 'center' }}
              >
                Enter the recovery phrase associated with your existing wallet.
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
              bottom: verticalScale(120),
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
        </View>
      )}
    </View>
  );
};
