import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { Transaction } from '@models';
import { scale, verticalScale } from '@utils/scaling';
import {
  KeyboardDismissingView,
  Row,
  Spacer,
  Spinner,
  Text
} from '@components/base';
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
      <KeyboardDismissingView>
        <Row>
          <Spacer horizontal value={scale(16)} />
          <Text fontFamily="Inter_600SemiBold" fontSize={20}>
            Recent Activity
          </Text>
        </Row>
      </KeyboardDismissingView>
      <Spacer value={verticalScale(12)} />
      <FlatList<Transaction>
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(t, i) => t._id + i}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <Spacer value={verticalScale(34)} />}
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
    paddingHorizontal: scale(17),
    paddingBottom: '20%'
  }
});
