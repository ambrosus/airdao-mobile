/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
  useWindowDimensions,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WatchlistAddSuccess } from '@components/templates/WatchlistAddSuccess';
import { ExplorerAccountView, AccountTransactions } from '../ExplorerAccount';
import { BarcodeScanner } from '../BarcodeScanner';
import {
  Button,
  InputRef,
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { CloseIcon, ScannerIcon, SearchIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';
import {
  useAMBPrice,
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { etherumAddressRegex } from '@constants/regex';
import { BottomSheetWithHeader } from '@components/modular';
import { TabsNavigationProp } from '@appTypes/navigation';
import { useAllAddresses, useOnboardingStatus } from '@contexts';
import { FloatButton } from '@components/base/FloatButton';
import { COLORS } from '@constants/colors';
import { OnboardingView } from '../OnboardingView';
import { styles } from './styles';

interface SearchAdressProps {
  initialValue?: string;
  withOnboarding?: boolean;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

const LIMIT = 10;
const demoAddress = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

export const SearchAddress = (props: SearchAdressProps): JSX.Element => {
  const {
    initialValue,
    withOnboarding,
    onContentVisibilityChanged = () => null
  } = props;
  const navigation = useNavigation<TabsNavigationProp>();
  // get status of current tooltip
  const { status } = useOnboardingStatus((v) => v);

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
  const accountRef = useRef(account);
  const ambTokenRef = useRef(ambToken);
  const { watchlist, addToWatchlist } = useWatchlist();
  const allAdresses = useAllAddresses();
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const successModal = useRef<BottomSheetRef>(null);

  // onboarding registration
  const setOnboardingAddress = () => {
    inputRef.current?.setText(demoAddress);
    initialMount.current = false;
    setAddress(demoAddress);
    onContentVisibilityChanged(true);
    inputRef.current?.setText(demoAddress);
  };

  const onSearchTooltipBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    accountRef.current = account;
    ambTokenRef.current = ambToken;
  }, [account, ambToken]);

  // listen to parent; especially useful for route params, dynamic links
  useEffect(() => {
    if (initialValue) {
      initialMount.current = false;
      setAddress(initialValue);
      onContentVisibilityChanged(true);
      inputRef.current?.setText(initialValue);
    }
  }, [initialValue, onContentVisibilityChanged]);

  const trackAddress = async () => {
    if (accountRef.current) {
      if (
        !withOnboarding &&
        watchlist.indexOfItem(accountRef.current, 'address') > -1
      ) {
        navigation.jumpTo('Wallets');
        return;
      }
      const finalAccount =
        allAdresses.find((a) => a.address === accountRef.current?.address) ||
        accountRef.current;
      accountRef.current.isOnWatchlist = true;
      if (ambTokenRef.current) {
        addToWatchlist(finalAccount);
        showSuccessModal();
      }
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

  const clearInput = () => {
    inputRef.current?.clear();
    onContentVisibilityChanged(address === '');
    setAddress('');
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

  const showSuccessModal = () => {
    setTimeout(() => {
      successModal.current?.show();
    }, 300);
  };

  const addressInWatchlist = useMemo(() => {
    const idx = watchlist.findIndex((w) => w.address === address);
    if (idx > -1) return watchlist[idx];
    return null;
  }, [watchlist, address]);

  return (
    <>
      <KeyboardDismissingView
        style={{
          flex: searchInputFocused && !account ? 1 : 0
        }}
      >
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={styles.top}
        >
          <OnboardingView
            thisStep={2}
            tooltipPlacement="bottom"
            childrenAlwaysVisible={true}
            helpers={{
              next: setOnboardingAddress,
              back: onSearchTooltipBack
            }}
            removeAndroidStatusBarHeight
          >
            <InputWithIcon
              testID="search-input"
              ref={inputRef}
              style={styles.input}
              iconLeft={<SearchIcon color="#2f2b4399" />}
              iconRight={
                <Button onPress={clearInput} style={{ zIndex: 1000 }}>
                  <CloseIcon color="#2f2b4399" scale={0.75} />
                </Button>
              }
              placeholder={'Search public address'}
              returnKeyType="search"
              onFocus={onInputFocused}
              onBlur={onInputBlur}
              onSubmitEditing={onInputSubmit}
            />
          </OnboardingView>
          <Spacer value={scale(7.5)} horizontal />
          <Button onPress={showScanner} type="circular" style={styles.scanner}>
            <ScannerIcon color={COLORS.electricBlue} />
          </Button>
        </Row>
      </KeyboardDismissingView>
      <BottomSheet height={WINDOW_HEIGHT} ref={scannerModalRef}>
        <BarcodeScanner onScanned={onQRCodeScanned} onClose={hideScanner} />
      </BottomSheet>
      {loading && !!address && <Spinner />}
      {error && !!address && (
        <View style={styles.error}>
          <Text>Could not find the address</Text>
        </View>
      )}
      {account && explorerInfo && (
        <View style={{ flex: 1 }}>
          <Spacer value={verticalScale(22)} />
          <KeyboardDismissingView>
            <ExplorerAccountView
              account={account}
              totalSupply={explorerInfo.totalSupply}
              watchlistDisplayType="explorer"
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
          <OnboardingView
            type="float"
            thisStep={3}
            childrenAlwaysVisible
            tooltipPlacement="top"
            helpers={{
              next: trackAddress
            }}
            removeAndroidStatusBarHeight
          >
            {status === 3 ? (
              <View style={styles.trackBtn}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={16}
                  fontWeight="600"
                  color={COLORS.white}
                >
                  {addressInWatchlist ? 'Go to watchlist' : 'Track Address'}
                </Text>
              </View>
            ) : (
              <FloatButton
                title={addressInWatchlist ? 'Go to watchlist' : 'Track Address'}
                icon={<></>}
                onPress={trackAddress}
              />
            )}
          </OnboardingView>
          <BottomSheetWithHeader
            containerStyle={{
              marginHorizontal: -20,
              marginBottom: -20,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
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
        </View>
      )}
    </>
  );
};
