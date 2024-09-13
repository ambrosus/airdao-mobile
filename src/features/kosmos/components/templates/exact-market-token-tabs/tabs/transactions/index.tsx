import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { styles } from './styles';
import { TransactionHistoryItem } from '@features/kosmos/components/base';
import { MarketType, TxType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { upperCase } from 'lodash';
import { COLORS } from '@constants/colors';
import { Row, Text } from '@components/base';
import { useMarketTransactions } from '@features/kosmos/lib/query';

interface TransactionsHistoryTabProps {
  market: MarketType | undefined;
}
const ESTIMATED_ITEM_SIZE = 26;
export const TransactionsHistoryTab = ({
  market
}: TransactionsHistoryTabProps) => {
  const { t } = useTranslation();

  const LIST_HEADER_TITLES = ['bonds', t('kosmos.payout'), t('common.date')];
  const { quoteToken, payoutToken } = useMarketDetails(market);

  const { transactions, isLoading, refetch } = useMarketTransactions(
    market?.id
  );

  const renderTransactionListItem = useCallback(
    (args: ListRenderItemInfo<TxType>) => {
      const { item: transaction } = args;

      return (
        <TransactionHistoryItem
          key={args.index.toString()}
          transaction={transaction}
          quoteToken={quoteToken}
          payoutToken={payoutToken}
        />
      );
    },
    [payoutToken, quoteToken]
  );

  return (
    <View style={styles.container}>
      <Row width="80%" alignItems="center" justifyContent="space-between">
        {LIST_HEADER_TITLES.map((heading, index) => (
          <Text
            key={index}
            fontSize={12}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
            style={styles.tableHeaderTextStyle}
          >
            {upperCase(heading)}
          </Text>
        ))}
      </Row>

      {isLoading ? (
        <View style={{ height: 550 }}></View>
      ) : (
        <View style={styles.list}>
          <FlashList
            estimatedItemSize={ESTIMATED_ITEM_SIZE}
            scrollEnabled={true}
            onRefresh={refetch}
            refreshing={false}
            nestedScrollEnabled={true}
            contentInsetAdjustmentBehavior="always"
            data={transactions}
            keyExtractor={(item) => item.txHash}
            renderItem={renderTransactionListItem}
            removeClippedSubviews={false}
          />
        </View>
      )}
    </View>
  );
};
