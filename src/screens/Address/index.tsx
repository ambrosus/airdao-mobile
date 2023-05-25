import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetRef, Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import { EditIcon, OptionsIcon } from '@components/svg/icons';
import { Button, Spacer, Spinner, Text } from '@components/base';
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
import { verticalScale } from '@utils/scaling';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';
import { Toast, ToastType } from '@components/modular';
import { styles } from './styles';
import { COLORS } from '@constants/colors';

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
  const { watchlist } = useWatchlist();
  const { personalList } = usePersonalList();
  const editModal = useRef<BottomSheetRef>(null);

  const walletInWatchlist = watchlist.find((w) => w.address === address);
  const walletInPersonalList = personalList.find((w) => w.address === address);
  const finalAccount = walletInWatchlist || walletInPersonalList || account;

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

  const onToggleWatchlist = (isOnWatchlist: boolean) => {
    Toast.hide();
    const toastMessage = isOnWatchlist
      ? `${finalAccount.name || 'The address'} is now on your Watchlists!`
      : `You removed ${finalAccount.name || 'the address'} from Watchlists!`;
    Toast.show({ message: toastMessage, type: ToastType.Top, title: '' });
  };

  const renderHeaderRight = () => {
    return (
      <Button style={styles.headerBtn} type="circular" onPress={showEditModal}>
        {Platform.select({
          ios: <EditIcon color={COLORS.smokyBlack} />,
          android: <OptionsIcon color={COLORS.smokyBlack} />
        })}
      </Button>
    );
  };

  return (
    <SafeAreaView testID="address-screen" style={styles.container}>
      <Header contentRight={renderHeaderRight()} />
      <ExplorerAccountView
        account={finalAccount}
        nameVisible={true}
        onToggleWatchlist={onToggleWatchlist}
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
