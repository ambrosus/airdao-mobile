import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
  useWindowDimensions,
  Platform,
  Dimensions
} from 'react-native';
import { WatchlistAddSuccess } from '@components/templates/WatchlistAddSuccess';
import { ExplorerAccountView, AccountTransactions } from '../ExplorerAccount';
import { BarcodeScanner } from '../BarcodeScanner';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Spacer,
  Spinner
} from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { ScannerQRIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import {
  useAMBPrice,
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { etherumAddressRegex } from '@constants/regex';
import { BottomSheetWithHeader, Toast, ToastType } from '@components/modular';
import { useAllAddresses } from '@contexts';
import { CRYPTO_ADDRESS_MAX_LENGTH } from '@constants/variables';
import { SearchAddressNoResult } from './SearchAddress.NoMatch';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
import { styles } from './styles';

interface SearchAdressProps {
  initialValue?: string;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

const LIMIT = 10;

export const SearchAddress = (props: SearchAdressProps): JSX.Element => {
  const { initialValue, onContentVisibilityChanged = () => null } = props;

  const { data: ambToken } = useAMBPrice();
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
  // const accountRef = useRef(account);
  const { addToWatchlist, removeFromWatchlist } = useWatchlist();
  const allAdresses = useAllAddresses();

  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const successModal = useRef<BottomSheetRef>(null);
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

  const toggleWatchlist = async () => {
    if (finalAccount) {
      if (finalAccount.isOnWatchlist) {
        removeFromWatchlist(finalAccount);
        // if (accountRef.current) accountRef.current.isOnWatchlist = false;
      } else {
        addToWatchlist(finalAccount);
        Toast.show({
          title: 'Way to go! Address watchlisted.',
          message: 'Tap to rename Address',
          type: ToastType.Top,
          onBodyPress: editModal.current?.show
        });
        // if (accountRef.current) accountRef.current.isOnWatchlist = true;
      }
    }
  };

  const onInputFocused = () => {
    onContentVisibilityChanged(true);
  };

  const onInputBlur = () => {
    if (!account && !loading) {
      onContentVisibilityChanged(false);
    }
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

  const hideSuccessModal = () => {
    successModal.current?.dismiss();
  };

  return (
    <>
      <KeyboardDismissingView style={styles.input}>
        <InputWithIcon
          testID="search-input"
          ref={inputRef}
          maxLength={CRYPTO_ADDRESS_MAX_LENGTH}
          iconRight={
            <Button onPress={showScanner}>
              <ScannerQRIcon />
            </Button>
          }
          placeholder={'Search public address'}
          returnKeyType="search"
          onFocus={onInputFocused}
          onBlur={onInputBlur}
          onSubmitEditing={onInputSubmit}
        />
      </KeyboardDismissingView>

      <BottomSheet height={WINDOW_HEIGHT} ref={scannerModalRef}>
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
      {loading && !!address && <Spinner />}
      {error && !!address && <SearchAddressNoResult />}
      {account && explorerInfo && (
        <View style={{ flex: 1 }}>
          <Spacer value={verticalScale(22)} />
          <KeyboardDismissingView>
            {finalAccount && (
              <ExplorerAccountView
                account={finalAccount}
                onToggleWatchlist={toggleWatchlist}
              />
            )}
          </KeyboardDismissingView>
          <Spacer value={verticalScale(24)} />
          <View style={styles.divider} />
          <Spacer value={verticalScale(24)} />
          <AccountTransactions
            transactions={transactions}
            onEndReached={loadMoreTransactions}
            loading={transactionsLoading && !!address}
          />
          <BottomSheetWithHeader
            containerStyle={styles.bottomSheetHeader}
            ref={successModal}
            height={
              Platform.OS === 'android' ? Dimensions.get('screen').height : 0
            }
            title=""
            fullscreen={Platform.OS === 'ios' && true}
          >
            {ambToken && account && (
              <WatchlistAddSuccess
                onDone={hideSuccessModal}
                address={address}
              />
            )}
          </BottomSheetWithHeader>
          <BottomSheetEditWallet ref={editModal} wallet={account} />
        </View>
      )}
    </>
  );
};
