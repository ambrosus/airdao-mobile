import React, { useCallback, useMemo } from 'react';
import { RefreshControl, View, VirtualizedList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { useClaimState } from '@features/kosmos/lib/hooks';
import { ScreenLoader } from '@features/kosmos/components/base';
import { TotalOrdersAmount } from '../../composite/total-orders-amount';
import { ClaimableOrderCardDetails } from '@features/kosmos/components/composite';
import {
  TransactionListItem,
  TxType,
  useTransactions,
  useTransactions as useOrders
} from '@entities/kosmos';

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

  if (isTransactionsLoading) {
    return <ScreenLoader />;
  }

  const getItem = (
    _data: TxType[] | [],
    index: number
  ): { id: string; transaction: TxType } => {
    const transaction = _data[index];
    return {
      id: transaction.txHash,
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
        keyExtractor={(item) => item.id}
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
