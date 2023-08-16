import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { CopyToClipboardButton, Header } from '@components/composite';
import { useAddWalletContext } from '@contexts';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { WalletUtils } from '@utils/wallet';
import { StringUtils } from '@utils/string';

export const CreateWalletStep2 = () => {
  const { walletMnemonic } = useAddWalletContext();
  const [walletMnemonicSelected, setWalletMnemonicSelected] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addressToCopy, setAddressToCopy] = useState<string>('');
  const walletMnemonicArrayDefault = walletMnemonic.split(' ');
  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );

  const validateMnemonic = useCallback(async () => {
    if (walletMnemonicSelected.length !== walletMnemonicArrayDefault.length) {
      return false;
    }
    if (
      JSON.stringify(walletMnemonicSelected) !==
      JSON.stringify(walletMnemonicArrayDefault)
    ) {
      // Alert.alert('Failed');
      // return;
    }
    // console.log('here');
    // setLoading(true);
    // TODO fix number
    const { address } = await WalletUtils.processWallet({
      number: 0,
      mnemonic: walletMnemonic,
      name: ''
    });
    console.log(address);
    setAddressToCopy(address);
  }, [walletMnemonic, walletMnemonicArrayDefault, walletMnemonicSelected]);

  useEffect(() => {
    // console.log('here');
    validateMnemonic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletMnemonicSelected]);

  const renderWord = (word: string) => {
    const selectedIdx = walletMnemonicSelected.indexOf(word);
    const onPress = () => {
      if (selectedIdx > -1) {
        walletMnemonicSelected.splice(selectedIdx, 1);
        setWalletMnemonicSelected([...walletMnemonicSelected]);
      } else {
        walletMnemonicSelected.push(word);
        setWalletMnemonicSelected([...walletMnemonicSelected]);
      }
    };
    return (
      <Button key={word} style={styles.word} onPress={onPress}>
        <Text>{word}</Text>
      </Button>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Create Wallet" />
      <Spacer value={verticalScale(24)} />
      {loading && <Spinner size="large" />}
      <View style={styles.innerContainer}>
        <Row style={styles.words}>{walletMnemonicSelected.map(renderWord)}</Row>
        <Spacer
          value={verticalScale(walletMnemonicSelected.length > 0 ? 36 : 0)}
        />
        {Array.isArray(walletMnemonicRandomSorted) && (
          <Row style={styles.words}>
            {walletMnemonicRandomSorted
              .filter((word) => walletMnemonicSelected.indexOf(word) === -1)
              .map(renderWord)}
          </Row>
        )}
        <Spacer value={verticalScale(24)} />
        {addressToCopy.length > 0 && (
          <CopyToClipboardButton
            textToDisplay={StringUtils.formatAddress(addressToCopy, 11, 5)}
            textToCopy={addressToCopy}
            textProps={{
              fontSize: 13,
              fontFamily: 'Inter_600SemiBold',
              color: COLORS.slateGrey
            }}
          />
        )}
        <Spacer value={verticalScale(24)} />
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
  words: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: scale(16),
    columnGap: verticalScale(16)
  },
  word: {
    backgroundColor: COLORS.neutral900Alpha[5],
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(4)
  }
});
