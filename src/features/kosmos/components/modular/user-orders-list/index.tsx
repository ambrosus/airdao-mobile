import React, { useCallback, useMemo } from 'react';
import { RefreshControl, View, VirtualizedList } from 'react-native';
import { styles } from './styles';
import { useTransactions } from '@features/kosmos/lib/hooks';
import { ScreenLoader } from '@features/kosmos/components/base';
import { TxType } from '@features/kosmos/types';
import { TotalOrdersAmount } from '../../composite/total-orders-amount';
import { useClaim } from '@screens/Kosmos/hooks/useClaim';
import { ClaimableOrderCardDetails } from '@features/kosmos/components/composite';

export const UserOrdersList = () => {
  const { transactions, isTransactionsLoading, refetchTransactions } =
    useTransactions();
  const { claimingTransaction, setClamingTransaction } = useClaim();
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

  const renderOrderListItem = (args: {
    index: number;
    item: {
      id: string;
      transaction: TxType;
    };
  }) => {
    const { transaction } = args.item;
    return (
      <ClaimableOrderCardDetails
        transaction={transaction}
        claimingTransaction={claimingTransaction}
        setClamingTransaction={setClamingTransaction}
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
