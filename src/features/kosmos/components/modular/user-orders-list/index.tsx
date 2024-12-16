import React, { useCallback, useMemo } from 'react';
import { RefreshControl, View, VirtualizedList } from 'react-native';
import { styles } from './styles';
import {
  useClaimState,
  useTransactions as useOrders,
  useTransactions
} from '@features/kosmos/lib/hooks';
import { ScreenLoader } from '@features/kosmos/components/base';
import { TransactionListItem, TxType } from '@features/kosmos/types';
import { TotalOrdersAmount } from '../../composite/total-orders-amount';

import { ClaimableOrderCardDetails } from '@features/kosmos/components/composite';
import { useFocusEffect } from '@react-navigation/native';

export const UserOrdersList = () => {
  const { transactions, isTransactionsLoading, refetchTransactions } =
    useTransactions();
  const { claimingTransaction, setClaimingTransaction } = useClaimState();
  const renderRefetchController = useMemo(
    () => (
      <RefreshControl
        onRefresh={refetchTransactions}
        refreshing={isTransactionsLoading}
        removeClippedSubviews
      />
    ),
    [isTransactionsLoading, refetchTransactions]
  );

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
  );
};
