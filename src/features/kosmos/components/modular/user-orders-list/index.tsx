import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useTransactions } from '@features/kosmos/lib/hooks';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { ScreenLoader } from '@features/kosmos/components/base';
import { TxType } from '@features/kosmos/types';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { TotalOrdersAmount } from '../../composite/total-orders-amount';
import { ClaimableOrderCardDetails } from '../../composite/claimable-order-card-details';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

const ESTIMATED_ITEM_SIZE = 172;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT };

export const UserOrdersList = () => {
  const { transactions } = useKosmosMarketsContextSelector();
  const { isTransactionsLoading, refetchTransactions } = useTransactions();

  const renderOrderListItem = useCallback(
    (args: ListRenderItemInfo<TxType>) => {
      const { item: transaction } = args;
      return <ClaimableOrderCardDetails transaction={transaction} />;
    },
    []
  );

  const RenderListFooterComponent = useCallback(() => {
    return <View style={styles.listFooterComponent} />;
  }, []);

  const sortedByDateTxs = useMemo(() => {
    return transactions.sort((a, b) => b.date - a.date);
  }, [transactions]);

  if (isTransactionsLoading) {
    return <ScreenLoader height="100%" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.totalReducedAmountsContainer}>
        <TotalOrdersAmount transactions={transactions} />
      </View>

      <FlashList
        keyExtractor={(item) => item.txHash}
        data={sortedByDateTxs}
        onRefresh={refetchTransactions}
        refreshing={isTransactionsLoading}
        contentContainerStyle={styles.listContentContainerStyle}
        renderItem={renderOrderListItem}
        ListFooterComponent={RenderListFooterComponent}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        estimatedListSize={ESTIMATED_LIST_SIZE}
        removeClippedSubviews
      />
    </View>
  );
};
