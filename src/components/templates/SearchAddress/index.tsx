import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WatchlistAddSuccess } from '@components/templates/WatchlistAddSuccess';
import { ExplorerAccountView } from '../ExplorerAccount';
import { AccountTransactions } from '../ExplorerAccount/ExplorerAccount.Transactions';
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
import { useAllAddresses } from '@contexts';
import { styles } from './styles';
import { OnboardingFloatButton } from '@components/templates/OnboardingFloatButton';
import { FloatButton } from '@components/base/FloatButton';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

interface SearchAdressProps {
  initialValue?: string;
  onContentVisibilityChanged?: (contentVisible: boolean) => unknown;
}

const LIMIT = 10;

export const SearchAddress = (props: SearchAdressProps): JSX.Element => {
  const { initialValue, onContentVisibilityChanged = () => null } = props;
  const navigation = useNavigation<TabsNavigationProp>();
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
  const { watchlist, addToWatchlist } = useWatchlist();
  const allAdresses = useAllAddresses();

  // get status of current tooltip
  const { status, handleStepChange } = useOnboardingStatus((v) => v);

  const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(true);

  const inputRef = useRef<InputRef>(null);
  const scannerModalRef = useRef<BottomSheetRef>(null);
  const scanned = useRef(false);
  const successModal = useRef<BottomSheetRef>(null);

  // listen to parent; especially useful for route params, dynamic links
  useEffect(() => {
    if (initialValue) {
      initialMount.current = false;
      setAddress(initialValue);
      onContentVisibilityChanged(true);
      inputRef.current?.setText(initialValue);
    }
  }, [initialValue, onContentVisibilityChanged]);

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
    // setAddress(e.nativeEvent.text);
    setAddress('0xF977814e90dA44bFA03b6295A0616a897441aceC');
  };

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const clearInput = () => {
    inputRef.current?.clear();
    setAddress('');
    onContentVisibilityChanged(false);
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

  const trackAddress = async () => {
    if (account) {
      if (watchlist.indexOfItem(account, 'address') > -1) {
        // TODO navigate to watchlist
        navigation.jumpTo('Wallets');
        return;
      }
      const finalAccount =
        allAdresses.find((a) => a.address === account.address) || account;
      account.isOnWatchlist = true;
      if (ambToken) {
        addToWatchlist(finalAccount);
        showSuccessModal();
      }
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

  const handleOnboardingStepChange = (type: 'back' | 'next') => {
    handleStepChange(type === 'back' ? 'step-2' : 'step-4');
    setIsToolTipVisible(false);
    if (type !== 'back') trackAddress();
    // else navigation.navigate('Wallets');
  };

  const handleSuccessModalClose = () => {
    successModal.current?.dismiss();
  };

  return (
    <>
      <KeyboardDismissingView>
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={styles.top}
        >
          <InputWithIcon
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
          <Spacer value={scale(7.5)} horizontal />
          <Button onPress={showScanner} type="circular" style={styles.scanner}>
            <ScannerIcon color="#000000" />
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
          <OnboardingFloatButton
            isToolTipVisible={isToolTipVisible}
            status={status}
            handleOnboardingStepChange={handleOnboardingStepChange}
            onboardingButtonTitle="Track Address"
          >
            <FloatButton
              title={addressInWatchlist ? 'Go to watchlist' : 'Track Address'}
              icon={<></>}
              onPress={trackAddress}
            />
          </OnboardingFloatButton>
          <BottomSheetWithHeader ref={successModal} fullscreen title="">
            {ambToken && account && (
              <WatchlistAddSuccess
                onDone={hideSuccessModal}
                address={address}
                status={status}
                handleSuccessModalClose={handleSuccessModalClose}
              />
            )}
          </BottomSheetWithHeader>
        </View>
      )}
    </>
  );
};
