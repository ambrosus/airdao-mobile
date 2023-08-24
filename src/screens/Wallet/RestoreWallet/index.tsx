import React, { useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheet,
  BottomSheetRef,
  Header,
  InputWithIcon
} from '@components/composite';
import { Button, InputRef, Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { Alert, useWindowDimensions, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { CloseIcon, ScannerQRIcon } from '@components/svg/icons';
import { PrimaryButton } from '@components/modular';
import { BarcodeScanner } from '@components/templates';
import { etherumAddressRegex } from '@constants/regex';
import { useNavigation } from '@react-navigation/native';
import { AddWalletStackNavigationProp } from '@appTypes';
import { useAddWalletContext } from '@contexts';
import { styles } from './styles';

export const RestoreWalletScreen = () => {
  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const { height: WINDOW_HEIGHT } = useWindowDimensions();

  const { walletMnemonic } = useAddWalletContext();

  const [searchValue, setSearchValue] = useState<string>('');
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);

  const isMnemonicValid = searchValue.match(etherumAddressRegex);
  const walletMnemonicArrayDefault = walletMnemonic.split(' ');
  const walletMnemonicRandomSorted = useMemo(
    () => walletMnemonicArrayDefault.sort(() => 0.5 - Math.random()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletMnemonicArrayDefault.length]
  );
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    walletMnemonicRandomSorted
  );

  const navigation = useNavigation<AddWalletStackNavigationProp>();
  const navigateToRestoreWallet = () => {
    Alert.alert('You have successfully restored your wallet!');
    navigation.navigate('Settings');
  };

  const clearSearch = () => {
    if (searchValue.length > 0) {
      const removedWords = searchValue.split(' ');
      setMnemonicWords((prevMnemonicWords) => [
        ...prevMnemonicWords,
        ...removedWords
      ]);
      setSearchValue('');
    }
  };

  const showScanner = () => {
    scannerModalRef.current?.show();
  };

  const hideScanner = () => {
    scannerModalRef.current?.dismiss();
  };

  const onQRCodeScanned = (data: string) => {
    const res = data.match(etherumAddressRegex);
    if (res && res?.length > 0) {
      hideScanner();
      inputRef.current?.setText(res[0]);
      setTimeout(() => {
        setSearchValue(res[0]);
      }, 500);
    } else if (!scanned.current) {
      scanned.current = true;
      Alert.alert('Invalid QR code', '', [
        {
          text: 'Scan again',
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

  const onChangeText = (text: string) => {
    const newValue = text.charAt(0).toLowerCase() + text.slice(1);
    setSearchValue(newValue);
    const words = newValue.split(' ');
    if (walletMnemonic.includes(newValue)) {
      const removedWords = mnemonicWords.filter(
        (word) => !words.includes(word)
      );
      setMnemonicWords(removedWords);
    }
  };

  const renderWord = (word: string) => {
    const onWordPress = () => {
      if (searchValue.length > 0) {
        setSearchValue(searchValue + ' ' + word);
      } else {
        setSearchValue(word);
      }
      setMnemonicWords(mnemonicWords.filter((item) => item !== word));
    };
    return (
      <Button key={word} style={styles.word} onPress={onWordPress}>
        <Text>{word}</Text>
      </Button>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Header
        title={
          <Text fontFamily="Inter_700Bold" fontSize={16} color={COLORS.nero}>
            Restore wallet
          </Text>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={verticalScale(16)} />
      <View style={styles.innerContainer}>
        <View>
          {showMnemonic ? (
            <>
              <Row style={styles.words}>{mnemonicWords.map(renderWord)}</Row>
              <Spacer value={verticalScale(24)} />
            </>
          ) : (
            <>
              <Text
                color={COLORS.nero}
                fontFamily="Inter_500Medium"
                fontSize={15}
                style={{ textAlign: 'center' }}
              >
                Insert the entire recovery phrase or enter all words manually
                (usually 12 or 24 words)
              </Text>
              <Spacer value={verticalScale(24)} />
            </>
          )}
        </View>
        <InputWithIcon
          ref={inputRef}
          iconRight={
            searchValue.length > 0 ? (
              <Button onPress={clearSearch}>
                <CloseIcon />
              </Button>
            ) : (
              <Button onPress={showScanner}>
                <ScannerQRIcon />
              </Button>
            )
          }
          placeholder="Recovery phrase"
          value={searchValue}
          onChangeText={onChangeText}
          onFocus={() => setShowMnemonic(true)}
          onBlur={() => setShowMnemonic(false)}
        />
        <Spacer value={verticalScale(24)} />
        <PrimaryButton
          onPress={navigateToRestoreWallet}
          disabled={!isMnemonicValid}
        >
          <Text color={COLORS.white} fontSize={15} fontFamily="Inter_500Medium">
            Restore wallet
          </Text>
        </PrimaryButton>
      </View>
      <BottomSheet
        height={WINDOW_HEIGHT}
        ref={scannerModalRef}
        borderRadius={0}
      >
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
    </SafeAreaView>
  );
};
