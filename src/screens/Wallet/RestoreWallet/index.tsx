import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { Spacer, Text, Button } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { View, Alert } from 'react-native';
import { COLORS } from '@constants/colors';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes/navigation/add-wallet';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@components/base/Input/Input.text';

export const RestoreWalletScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<AddWalletStackNavigationProp>();
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

  useEffect(() => {
    setIsButtonEnabled(mnemonicWords.every((word) => word.trim() !== ''));
  }, [mnemonicWords]);

  const handleWordChange = (index: number, text: string) => {
    const updatedWords = [...mnemonicWords];
    updatedWords[index] = text;
    setMnemonicWords(updatedWords);
  };

  const renderWords = () => {
    const wordInputs = [];
    for (let i = 0; i < 12; i += 2) {
      wordInputs.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          <TextInput
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

  const navigateToRestoreWallet = () => {
    if (isButtonEnabled) {
      Alert.alert('You have successfully restored your wallet!');
      navigation.navigate('Settings');
    }
  };

  return (
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
  );
};
