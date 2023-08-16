import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { Header } from '@components/composite';
import { MnemonicUtils } from '@utils/mnemonics';
import { useAddWalletContext } from '@contexts';
import { verticalScale, scale } from '@utils/scaling';
import { PrimaryButton } from '@components/modular';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';

export const CreateWalletStep1 = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const [loading, setLoading] = useState(false);
  const { walletMnemonic, mnemonicLength, setWalletMnemonic } =
    useAddWalletContext();
  const walletMnemonicArray = walletMnemonic.split(' ');

  const init = async () => {
    setLoading(true);
    // create mnemonic
    const walletMnemonic = (
      await MnemonicUtils.generateNewMnemonic(mnemonicLength)
    ).mnemonic;
    setWalletMnemonic(walletMnemonic);
    setLoading(false);
  };

  useEffect(() => {
    if (mnemonicLength > 0) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mnemonicLength]);

  const renderWord = (word: string, index: number) => {
    return (
      <Row key={word}>
        <Text>{index + 1}.</Text>
        <Text>
          {'  '}
          {word}
        </Text>
      </Row>
    );
  };

  const onNextPress = () => {
    navigation.navigate('CreateWalletStep2');
  };

  const halfArrayNum = Math.ceil(walletMnemonicArray.length / 2);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header title="Create Wallet" />
      {loading && (
        <View style={styles.loading}>
          <Spinner size="large" />
        </View>
      )}
      <Spacer value={verticalScale(24)} />
      <View style={styles.innerContainer}>
        {Array.isArray(walletMnemonicArray) && (
          <Row flex={1}>
            <View style={styles.column}>
              {walletMnemonicArray.slice(0, halfArrayNum).map(renderWord)}
            </View>
            <View style={styles.column}>
              {walletMnemonicArray
                .slice(halfArrayNum)
                .map((word, idx) => renderWord(word, idx + halfArrayNum))}
            </View>
          </Row>
        )}
        <PrimaryButton onPress={onNextPress}>
          <Text color={COLORS.white}>Next</Text>
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: scale(16)
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    flex: 1
  }
});
