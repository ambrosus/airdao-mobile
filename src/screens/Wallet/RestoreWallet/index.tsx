import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { Button, Spacer, Spinner, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { Alert, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@components/base/Input/Input.text';
import { styles } from '@screens/Wallet/RestoreWallet/styles';
import { AccountUtils } from '@utils/account';
import { HomeNavigationProp } from '@appTypes';

const bip39 = require('bip39');

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
          <TextInput
            autoCapitalize="none"
            style={{
              flex: 1,
              marginBottom: verticalScale(16)
            }}
            placeholder={`${i + 1}.`}
            placeholderTextColor={COLORS.nero}
            onChangeText={(text) => handleWordChange(i, text)}
          />
          <Spacer horizontal value={scale(16)} />
          <TextInput
            autoCapitalize="none"
            style={{
              flex: 1,
              marginBottom: verticalScale(16)
            }}
            placeholder={`${i + 2}.`}
            placeholderTextColor={COLORS.nero}
            onChangeText={(text) => handleWordChange(i + 1, text)}
          />
        </View>
      );
    }

    return wordInputs;
  };

  const isValidMnemonic = (mnemonicPhrase: string) => {
    return bip39.validateMnemonic(mnemonicPhrase);
  };

  const navigateToRestoreWallet = async () => {
    if (isButtonEnabled) {
      setIsLoading(true);
      try {
        const mnemonicPhrase = mnemonicWords.join(' ');
        if (!isValidMnemonic(mnemonicPhrase)) {
          Alert.alert('Invalid mnemonic phrase');
        } else {
          await AccountUtils.addAccountInfoToDatabase(mnemonicPhrase);
          navigation.navigate('SuccessImport');
        }
      } catch (error) {
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
            color={COLORS.nero}
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
                  color={COLORS.nero}
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
              color={COLORS.nero}
            >
              Enter recovery phrase
            </Text>
            <Spacer value={verticalScale(8)} />
            <View style={{ paddingHorizontal: scale(16) }}>
              <Text
                color={COLORS.nero}
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
                ? COLORS.mainBlue
                : COLORS.neutralGray
            }}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={isButtonEnabled ? COLORS.white : COLORS.neutral600}
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
