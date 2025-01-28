import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { Alert, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Text
} from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  CenteredSpinner,
  InputWithIcon
} from '@components/composite';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { CloseIcon, ScannerQRIcon, SearchIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { ethereumAddressRegex } from '@constants/regex';
import { CRYPTO_ADDRESS_MAX_LENGTH } from '@constants/variables';

import { useAddressesStore } from '@entities/addresses';
import {
  useExplorerInfo,
  useSearchAccount,
  useTransactionDetails,
  useTransactionsOfAccount
} from '@hooks';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { scale, verticalScale } from '@utils';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
import { SearchAddressNoResult } from './SearchAddress.NoMatch';
import { BarcodeScanner } from '../BarcodeScanner';
import { AccountTransactions, ExplorerAccountView } from '../ExplorerAccount';
import { TransactionDetails } from '../TransactionDetails';
import { styles } from './styles';

interface SearchAdressProps {
  scannerDisabled?: boolean;
  searchAddress?: boolean;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

export interface SearchAddressRef {
  setAddress: (address: string) => unknown;
  showScanner: () => unknown;
  hideScanner: () => unknown;
  focus: () => unknown;
}

const LIMIT = 10;

export const SearchAddress = forwardRef<SearchAddressRef, SearchAdressProps>(
  (
    {
      scannerDisabled = false,
      onContentVisibilityChanged = () => null,
      searchAddress = false
    },
    ref
  ): JSX.Element => {
    const { t } = useTranslation();
    const { height: WINDOW_HEIGHT } = useWindowDimensions();
    const { data: explorerInfo } = useExplorerInfo();
    const [address, setAddress] = useState('');
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const initialMount = useRef(true);

    const { allAddresses } = useAddressesStore();

    const {
      data: account,
      loading,
      error
    } = useSearchAccount(
      address,
      !initialMount.current &&
        !!address &&
        searchSubmitted &&
        address.length <= CRYPTO_ADDRESS_MAX_LENGTH
    );

    const {
      data: hashData,
      loading: isHashLoading,
      error: hashError
    } = useTransactionDetails(
      address,
      !initialMount.current &&
        !!address &&
        searchSubmitted &&
        address.length > CRYPTO_ADDRESS_MAX_LENGTH
    );

    const {
      data: transactions,
      loading: transactionsLoading,
      fetchNextPage,
      hasNextPage
    } = useTransactionsOfAccount(address, 1, LIMIT, '', !!address);
    const [searchInputFocused, setSearchInputFocused] = useState(false);

    const inputRef = useRef<InputRef>(null);
    const scannerModalRef = useRef<BottomSheetRef>(null);
    const scanned = useRef(false);
    const editModal = useRef<BottomSheetRef>(null);

    const finalAccount =
      allAddresses.find((a) => a.address === account?.address) || account;
    if (searchSubmitted && finalAccount) {
      sendFirebaseEvent(CustomAppEvents.explorer_search);
    }

    useImperativeHandle(
      ref,
      () => ({
        setAddress: (address) => {
          initialMount.current = false;
          setAddress(address);
          setSearchSubmitted(true);
          onContentVisibilityChanged(true);
          inputRef.current?.setText(address);
        },
        hideScanner,
        showScanner,
        focus
      }),
      [onContentVisibilityChanged]
    );

    const toggleWatchlist = async (isOnWatchlist: boolean) => {
      if (isOnWatchlist) {
        Toast.show({
          text: t('toast.address.watchlisted.msg'),
          subtext: t('toast.tap.to.rename.msg'),
          position: ToastPosition.Top,
          type: ToastType.Success,
          onBodyPress: editModal.current?.show
        });
      }
    };
    const onInputFocused = () => {
      onContentVisibilityChanged(true);
      setSearchInputFocused(true);
    };

    const onInputBlur = () => {
      if (!account && !loading && !hashData && !isHashLoading && !error) {
        onContentVisibilityChanged(false);
      }
      setSearchInputFocused(false);
    };

    const onInputSubmit = () => {
      initialMount.current = false;
      setSearchSubmitted(true);
    };

    const loadMoreTransactions = () => {
      if (hasNextPage) {
        fetchNextPage();
      }
    };

    const showScanner = () => {
      scannerModalRef.current?.show();
    };

    const focus = () => {
      inputRef?.current?.focus();
    };

    const hideScanner = () => {
      scannerModalRef.current?.dismiss();
    };
    const onQRCodeScanned = (data: string) => {
      const res = data.match(ethereumAddressRegex);
      if (res && res?.length > 0) {
        hideScanner();
        inputRef.current?.setText(res[0]);
        onContentVisibilityChanged(true);
        setTimeout(() => {
          initialMount.current = false;
          setAddress(res[0]);
          setSearchSubmitted(true);
        }, 500);
      } else if (!scanned.current) {
        scanned.current = true;
        Alert.alert(t('alert.invalid.qr.code.msg'), '', [
          {
            text: t('alert.scan.again.msg'),
            onPress: () => {
              scanned.current = false;
            }
          }
        ]);
      }
    };

    const clearInput = () => {
      inputRef.current?.clear();
      setAddress('');
    };

    const closeInput = () => {
      inputRef.current?.clear();
      inputRef.current?.blur();
      onContentVisibilityChanged(false);
      setAddress('');
      setSearchSubmitted(false);
    };

    const isLoading =
      (loading && !!address && !isHashLoading) ||
      (!loading && !!address && isHashLoading);

    const onChangeText = (text: string) => {
      setSearchSubmitted(false);
      setAddress(text);
    };

    const searchStyle: ViewStyle = searchAddress
      ? styles.search
      : {
          flex: searchInputFocused && !account ? 1 : 0
        };
    const IconRight = () => (
      <Row alignItems="center" style={styles.iconRow}>
        {address.length > 0 || searchAddress ? (
          <Button onPress={clearInput} style={styles.button}>
            <CloseIcon color={COLORS.alphaBlack50} scale={0.83} />
          </Button>
        ) : scannerDisabled ? null : (
          <Button onPress={showScanner}>
            <ScannerQRIcon />
          </Button>
        )}
      </Row>
    );

    return (
      <>
        <KeyboardDismissingView
          style={{
            ...styles.input,
            ...searchStyle
          }}
        >
          <View style={styles.inputWrapper}>
            <InputWithIcon
              testID="search-input"
              ref={inputRef}
              maxLength={68}
              iconLeft={<SearchIcon color={COLORS.alphaBlack50} />}
              style={searchAddress ? styles.searchAddress : {}}
              iconRight={<IconRight />}
              placeholder={t('explore.search.placeholder')}
              returnKeyType="search"
              onFocus={onInputFocused}
              onBlur={onInputBlur}
              onChangeText={onChangeText}
              onSubmitEditing={onInputSubmit}
            />
          </View>
          {searchAddress ? (
            <Button onPress={closeInput}>
              <Text style={styles.searchAddressButtonTitle}>
                {t('button.cancel')}
              </Text>
            </Button>
          ) : null}
        </KeyboardDismissingView>
        <BottomSheet
          height={WINDOW_HEIGHT}
          ref={scannerModalRef}
          borderRadius={0}
        >
          <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
        </BottomSheet>
        {isLoading && <CenteredSpinner containerStyle={styles.centerSpinner} />}
        {(error && !!address && !finalAccount) || (hashError && !!address) ? (
          <SearchAddressNoResult />
        ) : null}
        {finalAccount && explorerInfo && searchSubmitted ? (
          <KeyboardDismissingView style={styles.keyboardDismiss}>
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
            <Row alignItems="center">
              <Spacer horizontal value={scale(16)} />
              <Text
                fontFamily="Inter_700Bold"
                fontSize={20}
                color={COLORS.neutral800}
              >
                {t('common.transactions')}
              </Text>
            </Row>
            <Spacer value={verticalScale(12)} />
            <AccountTransactions
              transactions={transactions}
              onEndReached={loadMoreTransactions}
              loading={transactionsLoading && !!address}
            />
            <BottomSheetEditWallet ref={editModal} wallet={finalAccount} />
          </KeyboardDismissingView>
        ) : !!hashData ? (
          <KeyboardDismissingView style={styles.keyboardDismiss}>
            <Spacer value={verticalScale(24)} />
            <Text
              fontFamily="Inter_700Bold"
              fontSize={20}
              color={COLORS.neutral800}
            >
              {t('common.transaction.details')}
            </Text>
            <Spacer value={verticalScale(24)} />
            <TransactionDetails transaction={hashData} isShareable={false} />
          </KeyboardDismissingView>
        ) : null}
      </>
    );
  }
);
