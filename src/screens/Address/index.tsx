/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  BottomSheetSwiperIcon,
  EditIcon,
  PlusIcon,
  StarIcon
} from '@components/svg/icons';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { ExplorerAccountView, TransactionDetails } from '@components/templates';
import { AccountTransactions } from '@components/templates/ExplorerAccount/ExplorerAccount.Transactions';
import {
  useExplorerInfo,
  useSearchAccount,
  useTransactionsOfAccount,
  useWatchlist
} from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { Transaction } from '@models/Transaction';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { styles } from './styles';
import { BottomSheetEditWallet } from '@components/templates/BottomSheetEditWallet';

const TRANSACTION_LIMIT = 50;
export const AddressDetails = (): JSX.Element => {
  const { params } = useRoute<RouteProp<CommonStackParamsList, 'Address'>>();
  const { address } = params;
  const {
    data: account,
    loading: accountLoading,
    error: accountError
  } = useSearchAccount(address, true);
  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage,
    hasNextPage
  } = useTransactionsOfAccount(address, 1, TRANSACTION_LIMIT, '', true);
  const { data: explorerInfo, loading: explorerLoading } = useExplorerInfo();
  const { watchlist } = useWatchlist();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const transactionDetailsModal = useRef<BottomSheetRef>(null);
  const editModal = useRef<BottomSheetRef>(null);

  const walletInWatchlist = watchlist.find((w) => w.addressId === address);

  if (accountLoading || explorerLoading || !account || !explorerInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.center}>
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
          <Text>Error Occured</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const showTransactionDetails = (transaction: Transaction) => {
    transactionDetailsModal.current?.show();
    setSelectedTransaction(transaction);
  };

  const showEditModal = () => {
    editModal.current?.show();
  };

  const renderHeaderRight = () => {
    return (
      <Row alignItems="center">
        <Button style={styles.headerBtn} type="circular">
          <PlusIcon />
        </Button>
        <Spacer value={scale(17)} horizontal />
        <Button style={styles.headerBtn} type="circular">
          <StarIcon />
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
    <SafeAreaView style={styles.container}>
      <Header contentRight={renderHeaderRight()} />
      <Spacer value={verticalScale(52)} />
      <ExplorerAccountView
        account={account}
        totalSupply={explorerInfo?.totalSupply}
      />
      <Spacer value={verticalScale(32)} />
      <View style={styles.divider} />
      <Spacer value={verticalScale(32)} />
      <AccountTransactions
        transactions={transactions}
        onEndReached={loadMoreTransactions}
        loading={transactionsLoading && !!address}
        onPressTransaction={showTransactionDetails}
      />
      <BottomSheet ref={transactionDetailsModal} height={verticalScale(556.58)}>
        <View style={styles.transactionDetailsTop}>
          <BottomSheetSwiperIcon />
          <Spacer value={verticalScale(26.46)} />
          <Text fontSize={20} fontFamily="Inter_700Bold" fontWeight="600">
            Transaction Details
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <TransactionDetails transaction={selectedTransaction!} />
        </View>
      </BottomSheet>
      {walletInWatchlist && (
        <BottomSheetEditWallet ref={editModal} wallet={walletInWatchlist} />
      )}
    </SafeAreaView>
  );
};
