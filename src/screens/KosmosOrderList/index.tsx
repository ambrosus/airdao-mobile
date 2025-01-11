import React, { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  View,
  VirtualizedList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '@components/composite';
import {
  ClaimableOrderCardDetails,
  ScreenLoader,
  TotalOrdersAmount
} from '@features/kosmos/components';
import {
  useMarketTokens,
  TransactionListItem,
  TxType,
  useTransactions,
  useTransactions as useOrders,
  useClaimState
} from '@features/kosmos/entries';
import { styles } from './styles';

export const KosmosOrderList = () => {
  const { transactions, isTransactionsLoading, refetchTransactions } =
    useTransactions();
  const { claimingTransaction, setClaimingTransaction } = useClaimState();
  const { refetchTokens, isTokensLoading } = useMarketTokens();

  const renderRefetchController = useMemo(() => {
    const refreshing = isTransactionsLoading || isTokensLoading;
    const onRefresh = () => {
      refetchTokens();
      refetchTransactions();
    };

    return (
      <RefreshControl
        onRefresh={onRefresh}
        refreshing={refreshing}
        removeClippedSubviews
      />
    );
  }, [
    isTokensLoading,
    isTransactionsLoading,
    refetchTokens,
    refetchTransactions
  ]);

  const { refetchTransactions: refetchOrders } = useOrders();

  useFocusEffect(
    useCallback(() => {
      refetchOrders();
    }, [refetchOrders])
  );

  const renderOrderListItem = (args: TransactionListItem) => {
    const { transaction } = args.item;
    return (
      <ClaimableOrderCardDetails
        transaction={transaction}
        claimingTransaction={claimingTransaction}
        setClaimingTransaction={setClaimingTransaction}
      />
    );
  };

  const RenderListFooterComponent = useCallback(() => {
    return <View style={styles.listFooterComponent} />;
  }, []);

  const sortedByDateTxs = useMemo(() => {
    return transactions.sort((a, b) => b.date - a.date);
  }, [transactions]);

  const listKeyExtractor = useCallback(
    ({ index, transaction }: { index: number; transaction: TxType }) =>
      `${index}-${transaction.txHash}`,
    []
  );

  if (isTransactionsLoading) {
    return <ScreenLoader />;
  }

  const getItem = (
    _data: TxType[] | [],
    index: number
  ): { id: string; index: number; transaction: TxType } => {
    const transaction = _data[index];
    return {
      id: transaction.txHash,
      index,
      transaction
    };
  };

  const getItemCount = (_data: TxType[] | []) => _data.length;

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Header
        title="Kosmos"
        bottomBorder
        style={styles.header}
        leftContainerStyles={styles.leftContainerStyles}
        titlePosition="center"
        backIconVisible
      />

      <View style={styles.container}>
        <View style={styles.totalReducedAmountsContainer}>
          <TotalOrdersAmount transactions={transactions} />
        </View>

        <VirtualizedList
          keyExtractor={listKeyExtractor}
          initialNumToRender={4}
          data={sortedByDateTxs}
          refreshControl={renderRefetchController}
          renderItem={renderOrderListItem}
          getItemCount={getItemCount}
          getItem={getItem}
          ListFooterComponent={RenderListFooterComponent}
          removeClippedSubviews
        />
      </View>
    </SafeAreaView>
  );
};
