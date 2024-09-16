import React, { useMemo } from 'react';
import { RefreshControl, View, VirtualizedList } from 'react-native';
import { useTranslation } from 'react-i18next';
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
export const TransactionsHistoryTab = ({
  market
}: TransactionsHistoryTabProps) => {
  const { t } = useTranslation();

  const LIST_HEADER_TITLES = ['bonds', t('kosmos.payout'), t('common.date')];
  const { quoteToken, payoutToken } = useMarketDetails(market);

  const { transactions, isLoading, refetch } = useMarketTransactions(
    market?.id
  );
  const renderRefetchController = useMemo(
    () => (
      <RefreshControl
        onRefresh={refetch}
        refreshing={isLoading}
        removeClippedSubviews
      />
    ),
    [isLoading, refetch]
  );

  const renderTransactionListItem = (item: {
    index: number;
    item: {
      id: string;
      transaction: TxType;
    };
  }) => {
    const { transaction, id } = item.item;
    return (
      <TransactionHistoryItem
        key={id}
        transaction={transaction}
        quoteToken={quoteToken}
        payoutToken={payoutToken}
      />
    );
  };

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
          <VirtualizedList
            refreshControl={renderRefetchController}
            initialNumToRender={4}
            data={transactions}
            renderItem={renderTransactionListItem}
            keyExtractor={(item) => item.id}
            getItemCount={getItemCount}
            getItem={getItem}
            contentInsetAdjustmentBehavior="always"
            removeClippedSubviews={false}
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
};
