import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { Transaction } from '@models';
import { scale, verticalScale } from '@utils/scaling';
import { Spacer, Spinner } from '@components/base';
import { ExplorerAccountTransactionItem } from './ExplorerAccount.TransactionItem';

interface ExplorerAccountViewTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  showTransactionDetailsOnPress?: boolean;
  onEndReached?: () => unknown;
}

export const AccountTransactions = (
  props: ExplorerAccountViewTransactionsProps
): JSX.Element => {
  const { transactions, loading, showTransactionDetailsOnPress, onEndReached } =
    props;

  const renderTransaction = (
    args: ListRenderItemInfo<Transaction>
  ): JSX.Element => {
    return (
      <ExplorerAccountTransactionItem
        transaction={args.item}
        disabled={showTransactionDetailsOnPress}
      />
    );
  };

  return (
    <>
      <FlatList<Transaction>
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(t) => t.hash}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <Spacer value={verticalScale(32)} />}
        onEndReachedThreshold={0.6}
        onEndReached={onEndReached}
        ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingBottom: '40%'
  }
});
