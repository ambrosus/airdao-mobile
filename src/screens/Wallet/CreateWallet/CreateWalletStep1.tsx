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
import { WarningIcon } from '@components/svg/icons/Warning';

export const CreateWalletStep1 = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const [loading, setLoading] = useState(false);
  const { walletMnemonic, mnemonicLength, setWalletMnemonic } =
    useAddWalletContext();
  const walletMnemonicArray = walletMnemonic.split(' ');

  const init = async () => {
    setLoading(true);
    // create mnemonic
    // tslint:disable-next-line:no-shadowed-variable
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
      <>
        <Row key={word}>
          <View
            style={{
              backgroundColor: COLORS.gray100,
              borderRadius: 48,
              width: scale(100)
            }}
          >
            <Text
              align="center"
              fontFamily="Inter_600SemiBold"
              fontSize={12}
              color={COLORS.nero}
              style={{ marginHorizontal: scale(15), marginVertical: scale(8) }}
            >
              {index + 1} {word}
            </Text>
          </View>
        </Row>
        <Spacer value={verticalScale(20)} />
      </>
    );
  };

  const onNextPress = () => {
    navigation.navigate('CreateWalletStep2');
  };

  const wordsPerColumn = 4;
  const numColumns = Math.ceil(walletMnemonicArray.length / wordsPerColumn);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Header style={{ shadowColor: 'transparent' }} />
      <Text
        align="center"
        fontSize={24}
        fontFamily="Inter_700Bold"
        color={COLORS.nero}
      >
        Your recovery phrase
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        align="center"
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.nero}
      >
        Make sure to write it down as shown. You will verify this later.
      </Text>
      {loading && (
        <View style={styles.loading}>
          <Spinner size="large" />
        </View>
      )}
      <Spacer value={verticalScale(40)} />
      <View style={styles.innerContainer}>
        {Array.isArray(walletMnemonicArray) && (
          <Row flex={1}>
            {Array.from({ length: numColumns }, (_, columnIndex) => (
              <View style={styles.column} key={columnIndex}>
                {walletMnemonicArray
                  .slice(
                    columnIndex * wordsPerColumn,
                    (columnIndex + 1) * wordsPerColumn
                  )
                  .map((word, idx) =>
                    renderWord(word, idx + columnIndex * wordsPerColumn)
                  )}
              </View>
            ))}
          </Row>
        )}
        <View style={styles.warningContainer}>
          <View style={styles.warning}>
            <WarningIcon />
            <Spacer horizontal value={scale(12)} />
            <Text>
              Never share recovery phrase with {'\n'} anyone, keep it safe!
            </Text>
          </View>
        </View>
        <Spacer value={verticalScale(34)} />
        <PrimaryButton onPress={onNextPress}>
          <Text color={COLORS.white}>Verify phrase</Text>
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
  },
  warningContainer: {
    backgroundColor: COLORS.lemon,
    borderRadius: 13,
    borderWidth: 0.2,
    borderColor: '#ffac23'
  },
  warning: {
    marginVertical: scale(12),
    marginHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center'
  }
});
