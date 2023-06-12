import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
  useWindowDimensions
} from 'react-native';
import { ExplorerAccountView, AccountTransactions } from '../ExplorerAccount';
import { BarcodeScanner } from '../BarcodeScanner';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner
} from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { CloseIcon, ScannerQRIcon, SearchIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import {
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount
} from '@hooks';
import { etherumAddressRegex } from '@constants/regex';
import { Toast, ToastType } from '@components/modular';
import { useAllAddresses } from '@contexts';
import { CRYPTO_ADDRESS_MAX_LENGTH } from '@constants/variables';
import { SearchAddressNoResult } from './SearchAddress.NoMatch';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
import { styles } from './styles';
import { COLORS } from '@constants/colors';

interface SearchAdressProps {
  initialValue?: string;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

const LIMIT = 10;

export const SearchAddress = (props: SearchAdressProps): JSX.Element => {
  const { initialValue, onContentVisibilityChanged = () => null } = props;

  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const { data: explorerInfo } = useExplorerInfo();
  const [address, setAddress] = useState('');
  const initialMount = useRef(true);
  const {
    data: account,
    loading,
    error
  } = useSearchAccount(address, !initialMount.current && !!address);
  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage,
    hasNextPage
  } = useTransactionsOfAccount(address, 1, LIMIT, '', !!address);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const allAdresses = useAllAddresses();

  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const editModal = useRef<BottomSheetRef>(null);

  const finalAccount =
    allAdresses.find((a) => a.address === account?.address) || account;

  // listen to parent; especially useful for route params, dynamic links
  useEffect(() => {
    if (initialValue) {
      initialMount.current = false;
      setAddress(initialValue);
      onContentVisibilityChanged(true);
      inputRef.current?.setText(initialValue);
    }
  }, [initialValue, onContentVisibilityChanged]);

  const toggleWatchlist = async (isOnWatchlist: boolean) => {
    if (isOnWatchlist) {
      Toast.show({
        title: 'Way to go! Address watchlisted.',
        message: 'Tap to rename Address',
        type: ToastType.Top,
        onBodyPress: editModal.current?.show
      });
    }
  };

  const onInputFocused = () => {
    onContentVisibilityChanged(true);
    setSearchInputFocused(true);
  };

  const onInputBlur = () => {
    if (!account && !loading) {
      onContentVisibilityChanged(false);
    }
    setSearchInputFocused(false);
  };

  const onInputSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    initialMount.current = false;
    setAddress(e.nativeEvent.text);
  };

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
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
      onContentVisibilityChanged(true);
      setTimeout(() => {
        initialMount.current = false;
        setAddress(res[0]);
      }, 500);
    } else if (!scanned.current) {
      scanned.current = true;
      Alert.alert('Invalid QR Code', '', [
        {
          text: 'Scan Again',
          onPress: () => {
            scanned.current = false;
          }
        }
      ]);
    }
  };

  const clearInput = () => {
    inputRef.current?.clear();
    onContentVisibilityChanged(address === '');
    setAddress('');
  };

  return (
    <>
      <KeyboardDismissingView
        style={{
          ...styles.input,
          flex: searchInputFocused && !account ? 1 : 0
        }}
      >
        <InputWithIcon
          testID="search-input"
          ref={inputRef}
          maxLength={CRYPTO_ADDRESS_MAX_LENGTH}
          iconLeft={<SearchIcon color={COLORS.smokyBlack50} />}
          iconRight={
            <Row alignItems="center">
              {address.length > 0 && (
                <>
                  <Button onPress={clearInput} style={{ zIndex: 1000 }}>
                    <CloseIcon color={COLORS.smokyBlack50} scale={0.75} />
                  </Button>
                  <Spacer value={scale(12)} horizontal />
                </>
              )}

              <Button onPress={showScanner}>
                <ScannerQRIcon />
              </Button>
            </Row>
          }
          placeholder={'Search public address'}
          returnKeyType="search"
          onFocus={onInputFocused}
          onBlur={onInputBlur}
          onSubmitEditing={onInputSubmit}
        />
      </KeyboardDismissingView>
      <BottomSheet
        height={WINDOW_HEIGHT}
        ref={scannerModalRef}
        borderRadius={0}
      >
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
      {loading && !!address && <Spinner />}
      {error && !!address && !finalAccount && <SearchAddressNoResult />}
      {finalAccount && explorerInfo && (
        <KeyboardDismissingView style={{ flex: 1 }}>
          <Spacer value={verticalScale(24)} />
          <KeyboardDismissingView>
            <ExplorerAccountView
              account={finalAccount}
              onToggleWatchlist={toggleWatchlist}
            />
          </KeyboardDismissingView>
          <Spacer value={verticalScale(24)} />
          <View style={styles.divider} />
          <Spacer value={verticalScale(24)} />
          <AccountTransactions
            transactions={transactions}
            onEndReached={loadMoreTransactions}
            loading={transactionsLoading && !!address}
          />
          <BottomSheetEditWallet ref={editModal} wallet={finalAccount} />
        </KeyboardDismissingView>
      )}
    </>
  );
};
