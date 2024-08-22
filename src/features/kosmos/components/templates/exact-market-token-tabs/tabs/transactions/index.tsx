import React, { useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import {
  ScreenLoader,
  TransactionHistoryItem
} from '@features/kosmos/components/base';
import { MarketType, TxType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { upperCase } from 'lodash';
import { COLORS } from '@constants/colors';
import { Row, Text } from '@components/base';

interface TransactionsHistoryTabProps {
  market: MarketType;
  focused: boolean;
}

const ESTIMATED_ITEM_SIZE = 26;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT / 4 };

export const TransactionsHistoryTab = ({
  market,
  focused
}: TransactionsHistoryTabProps) => {
  const { t } = useTranslation();

  const LIST_HEADER_TITLES = ['bonds', t('kosmos.payout'), t('common.date')];
  const {
    marketTransactions,
    quoteToken,
    payoutToken,
    isMarketTransactionsFetching
  } = useMarketDetails(market);

  const transactions = useMemo(
    () => marketTransactions.sort((a, b) => b.date - a.date),
    [marketTransactions]
  );

  const renderTransactionListItem = useCallback(
    (args: ListRenderItemInfo<TxType>) => {
      const { item: transaction } = args;

      return (
        <TransactionHistoryItem
          transaction={transaction}
          quoteToken={quoteToken}
          payoutToken={payoutToken}
        />
      );
    },
    [payoutToken, quoteToken]
  );

  const combineContainerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      ...styles.container,
      height: focused ? 'auto' : 0
    };
  }, [focused]);

  return (
    <View style={combineContainerStyle}>
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

      {isMarketTransactionsFetching ? (
        <ScreenLoader height="75%" />
      ) : (
        <View style={styles.list}>
          <FlashList
            scrollEnabled={false}
            nestedScrollEnabled={false}
            data={transactions}
            estimatedItemSize={ESTIMATED_ITEM_SIZE}
            estimatedListSize={ESTIMATED_LIST_SIZE}
            keyExtractor={(item) => item.txHash}
            renderItem={renderTransactionListItem}
          />
        </View>
      )}
    </View>
  );
};
