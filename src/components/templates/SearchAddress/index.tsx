import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { Alert, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ExplorerAccountView, AccountTransactions } from '../ExplorerAccount';
import { BarcodeScanner } from '../BarcodeScanner';
import { TransactionDetails } from '../TransactionDetails';
import { SearchAddressNoResult } from './SearchAddress.NoMatch';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
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
import { CloseIcon, ScannerQRIcon, SearchIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import {
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount,
  useTransactionDetails
} from '@hooks';
import { etherumAddressRegex } from '@constants/regex';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { useAllAddresses } from '@contexts';
import { CRYPTO_ADDRESS_MAX_LENGTH } from '@constants/variables';
import { COLORS } from '@constants/colors';
import { SearchTabNavigationProp } from '@appTypes';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface SearchAdressProps {
  scannerDisabled?: boolean;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

export interface SearchAddressRef {
  setAddress: (address: string) => unknown;
  showScanner: () => unknown;
  hideScanner: () => unknown;
}

const LIMIT = 10;

export const SearchAddress = forwardRef<SearchAddressRef, SearchAdressProps>(
  (props: SearchAdressProps, ref): JSX.Element => {
    const { scannerDisabled = false, onContentVisibilityChanged = () => null } =
      props;
    const navigation = useNavigation<SearchTabNavigationProp>();
    const { height: WINDOW_HEIGHT } = useWindowDimensions();
    const { t } = useTranslation();
    const { data: explorerInfo } = useExplorerInfo();
    const [address, setAddress] = useState('');
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const initialMount = useRef(true);

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

    const allAdresses = useAllAddresses();

    const inputRef = useRef<InputRef>(null);
    const scannerModalRef = useRef<BottomSheetRef>(null);
    const scanned = useRef(false);
    const editModal = useRef<BottomSheetRef>(null);

    const finalAccount =
      allAdresses.find((a) => a.address === account?.address) || account;

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
        showScanner
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
      inputRef.current?.blur();
      onContentVisibilityChanged(false);
      setAddress('');
      setSearchSubmitted(false);
    };

    const isLoading =
      (loading && !!address && !isHashLoading) ||
      (!loading && !!address && isHashLoading);

    const navigateToAddressDetails = (address: string) => {
      navigation.navigate('Address', { address });
    };

    const onChangeText = (text: string) => {
      setSearchSubmitted(false);
      setAddress(text);
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
            maxLength={68}
            iconLeft={<SearchIcon color={COLORS.alphaBlack50} />}
            iconRight={
              <Row alignItems="center">
                {address.length > 0 ? (
                  <Button onPress={clearInput} style={{ zIndex: 1000 }}>
                    <CloseIcon color={COLORS.alphaBlack50} scale={0.83} />
                  </Button>
                ) : scannerDisabled ? null : (
                  <Button onPress={showScanner}>
                    <ScannerQRIcon />
                  </Button>
                )}
              </Row>
            }
            placeholder={t('explore.search.placeholder')}
            returnKeyType="search"
            onFocus={onInputFocused}
            onBlur={onInputBlur}
            onChangeText={onChangeText}
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
        {isLoading && <CenteredSpinner />}
        {(error && !!address && !finalAccount) || (hashError && !!address) ? (
          <SearchAddressNoResult />
        ) : null}
        {finalAccount && explorerInfo && searchSubmitted ? (
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
          <KeyboardDismissingView
            style={{ flex: 1, paddingHorizontal: scale(16) }}
          >
            <Spacer value={verticalScale(24)} />
            <Text
              fontFamily="Inter_700Bold"
              fontSize={20}
              color={COLORS.neutral800}
            >
              {t('common.transaction.details')}
            </Text>
            <Spacer value={verticalScale(24)} />
            <TransactionDetails
              transaction={hashData}
              isShareable={false}
              onPressAddress={navigateToAddressDetails}
            />
          </KeyboardDismissingView>
        ) : null}
      </>
    );
  }
);
