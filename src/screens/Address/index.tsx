import React, { useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetRef, Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  CheckmarkCircleIcon,
  EditIcon,
  PlusIcon,
  StarFilledIcon,
  StarIcon
} from '@components/svg/icons';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import {
  ExplorerAccountView,
  AccountTransactions
} from '@components/templates';
import {
  useExplorerInfo,
  usePersonalList,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { Toast, ToastType } from '@components/modular';
import { styles } from './styles';

const TRANSACTION_LIMIT = 50;
export const AddressDetails = (): JSX.Element => {
  const { params } = useRoute<RouteProp<CommonStackParamsList, 'Address'>>();
  const { address } = params;
  const initialMount = useRef(true);
  const {
    data: account,
    loading: accountLoading,
    error: accountError
  } = useSearchAccount(address, initialMount.current);
  initialMount.current = false;
  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage,
    hasNextPage
  } = useTransactionsOfAccount(address, 1, TRANSACTION_LIMIT, '', true);
  const { data: explorerInfo, loading: explorerLoading } = useExplorerInfo();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { personalList, addToPersonalList, removeFromPersonalList } =
    usePersonalList();
  const editModal = useRef<BottomSheetRef>(null);

  const walletInWatchlist = watchlist.find((w) => w.address === address);
  const walletInPersonalList = personalList.find((w) => w.address === address);
  const finalAccount = walletInWatchlist || walletInPersonalList || account;
  const finalAccountRef = useRef(finalAccount);

  if (accountLoading || explorerLoading || !finalAccount || !explorerInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View testID="loading-spinner" style={styles.center}>
          <Spinner />
        </View>
      </SafeAreaView>
    );
  }

  if (accountError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.center}>
          <Text>Error Occurred</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const showEditModal = () => {
    editModal.current?.show();
  };

  const toggleWatchlist = () => {
    Toast.hide();
    const toastMessage = finalAccountRef.current?.isOnWatchlist
      ? `You removed ${finalAccount.name || 'the address'} from Watchlists!`
      : `${finalAccount.name || 'The address'} is now on your Watchlists!`;
    const onUndo = toggleWatchlist;
    Toast.show({ message: toastMessage, type: ToastType.Top, onUndo });
    // TOOD: set timeout to show Toast immediately before context update.
    // context updates shouldn't be too expensive but they seem to be.
    setTimeout(() => {
      finalAccountRef.current?.isOnWatchlist
        ? removeFromWatchlist(finalAccount)
        : addToWatchlist(finalAccount);
      if (finalAccountRef.current) {
        if (finalAccountRef.current.isOnWatchlist) {
          finalAccountRef.current.isOnWatchlist = false;
        } else {
          finalAccountRef.current.isOnWatchlist = true;
        }
      }
    }, 0);
  };

  const togglePersonalList = () => {
    Toast.hide();
    const toastMessage = finalAccountRef.current?.isPersonal
      ? `You removed ${
          finalAccount.name || 'the address'
        } from Personal Addresses!`
      : `${
          finalAccount.name || 'The address'
        } is now on your Personal Addresses!`;
    const onUndo = togglePersonalList;
    Toast.show({ message: toastMessage, type: ToastType.Top, onUndo });
    // TOOD: set timeout to show Toast immediately before context update.
    // context updates shouldn't be too expensive but they seem to be.
    setTimeout(() => {
      finalAccountRef.current?.isPersonal
        ? removeFromPersonalList(finalAccount)
        : addToPersonalList(finalAccount);
      if (finalAccountRef.current) {
        if (finalAccountRef.current.isPersonal) {
          finalAccountRef.current.isPersonal = false;
        } else {
          finalAccountRef.current.isPersonal = true;
        }
      }
    }, 0);
  };

  const renderHeaderRight = () => {
    return (
      <Row alignItems="center">
        <Button
          testID="personal-list-button"
          // TODO change button background color when it's not pressed to #2f2b431a
          style={styles.headerPersonalListBtn}
          type="circular"
          onPress={togglePersonalList}
        >
          {!!walletInPersonalList ? <CheckmarkCircleIcon /> : <PlusIcon />}
        </Button>
        <Spacer value={scale(17)} horizontal />
        <Button
          testID="watchlist-button"
          // TODO change button background color when it's not pressed to #2f2b431a
          style={styles.headerWatchListBtn}
          type="circular"
          onPress={toggleWatchlist}
        >
          {!!walletInWatchlist ? <StarFilledIcon /> : <StarIcon />}
        </Button>
        <Spacer value={scale(17)} horizontal />
        <Button
          style={styles.headerBtn}
          type="circular"
          onPress={showEditModal}
        >
          <EditIcon />
        </Button>
      </Row>
    );
  };

  return (
    <SafeAreaView testID="address-screen" style={styles.container}>
      <Header contentRight={renderHeaderRight()} />
      <Spacer value={verticalScale(52)} />
      <ExplorerAccountView
        account={finalAccount}
        totalSupply={explorerInfo?.totalSupply}
        listInfoVisible={true}
        nameVisible={true}
      />
      <Spacer value={verticalScale(32)} />
      <View style={styles.divider} />
      <Spacer value={verticalScale(32)} />
      <AccountTransactions
        transactions={transactions}
        onEndReached={loadMoreTransactions}
        loading={transactionsLoading && !!address}
      />
      {finalAccount && (
        <BottomSheetEditWallet ref={editModal} wallet={finalAccount} />
      )}
    </SafeAreaView>
  );
};
