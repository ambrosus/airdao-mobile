import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { useTransactions } from '@features/kosmos/lib/hooks';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { ScreenLoader } from '../../base';
import { TxType } from '@features/kosmos/types';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { ClaimableOrderCardDetails } from '../claimable-order-card-details';

const ESTIMATED_ITEM_SIZE = 172;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT };

export const UserOrdersList = () => {
  const { transactions, isTransactionsLoading } = useTransactions();

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

  if (isTransactionsLoading) {
    return <ScreenLoader height="100%" />;
  }

  return (
    <View style={styles.container}>
      <FlashList
        keyExtractor={(item) => item.txHash}
        data={transactions}
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
