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
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes';

export const CreateWalletStep2 = () => {
  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const { walletMnemonic } = useAddWalletContext();
  const [walletMnemonicSelected, setWalletMnemonicSelected] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addressToCopy, setAddressToCopy] = useState<string>('');
  const [isMnemonicCorrect, setIsMnemonicCorrect] = useState<boolean>(false);
  const walletMnemonicArrayDefault = walletMnemonic.split(' ');
  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );

  const validateMnemonicOrder = () => {
    setIsMnemonicCorrect(
      JSON.stringify(walletMnemonicSelected) ===
        JSON.stringify(walletMnemonicArrayDefault)
    );
  };

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

  const numColumns = Math.ceil(walletMnemonicArrayDefault.length / 4);

  const renderWord = (word: string) => {
    const selectedIdx = walletMnemonicSelected.indexOf(word);
    const isCorrect = walletMnemonicArrayDefault.indexOf(word) === selectedIdx;

    const onPress = () => {
      if (selectedIdx > -1) {
        walletMnemonicSelected.splice(selectedIdx, 1);
      } else {
        walletMnemonicSelected.push(word);
      }
      setWalletMnemonicSelected([...walletMnemonicSelected]);
      validateMnemonicOrder();
    };
    return (
      <>
        <Button
          key={word}
          style={{
            backgroundColor: '#E6E6E6',
            borderRadius: 48
          }}
          onPress={onPress}
        >
          <Text
            align="center"
            fontFamily="Inter_600SemiBold"
            fontSize={14}
            color={
              isCorrect
                ? COLORS.jungleGreen
                : walletMnemonicSelected.includes(word)
                ? COLORS.crimsonRed
                : COLORS.nero
            }
            style={{ marginHorizontal: scale(15), marginVertical: scale(8) }}
          >
            {word}
          </Text>
        </Button>
        <Spacer value={verticalScale(20)} />
      </>
    );
  };

  const navigateToWalletScreen = () => {
    navigation.navigate('SuccessBackupComplete');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header style={{ shadowColor: 'transparent' }} />
      <Text
        align="center"
        fontSize={24}
        fontFamily="Inter_700Bold"
        color={COLORS.nero}
      >
        Let’s double check
      </Text>
      <Spacer value={verticalScale(12)} />
      <Text
        align="center"
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.nero}
      >
        Tap the words in the correct order
      </Text>
      <Spacer value={verticalScale(24)} />
      <View style={styles.mnemoicContainer}>
        {Array.isArray(walletMnemonicSelected) && (
          <Row style={styles.words}>
            {Array.from({ length: numColumns }, (_, columnIndex) => (
              <View key={columnIndex}>
                {walletMnemonicSelected
                  .slice(columnIndex * 4, (columnIndex + 1) * 4)
                  .map(renderWord)}
              </View>
            ))}
          </Row>
        )}
      </View>
      <Spacer value={verticalScale(24)} />
      {loading && <Spinner size="large" />}
      <View style={styles.innerContainer}>
        <Spacer value={verticalScale(36)} />
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
      </View>
      <Button
        disabled={!addressToCopy}
        onPress={navigateToWalletScreen}
        type="circular"
        style={{
          backgroundColor:
            addressToCopy.length > 0 ? COLORS.mainBlue : COLORS.neutralGray,
          marginBottom: scale(44),
          width: '90%',
          alignSelf: 'center'
        }}
      >
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={addressToCopy.length > 0 ? COLORS.white : '#0E0E0E4D'}
          style={{ marginVertical: scale(12) }}
        >
          Verify
        </Text>
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    alignItems: 'center'
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
  },
  mnemoicContainer: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    borderRadius: 16,
    borderColor: COLORS.gray100,
    borderWidth: 2,
    backgroundColor: COLORS.charcoal,
    width: '90%',
    height: verticalScale(232),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20)
  }
});
