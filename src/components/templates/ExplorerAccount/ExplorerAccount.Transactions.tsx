import React from 'react';
import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { Transaction } from '@models';
import { CenteredSpinner } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { ExplorerAccountTransactionItem } from './components';
import { LocalizedRenderEmpty } from '../LocalizedRenderEmpty';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import Animated from 'react-native-reanimated';

interface ExplorerAccountViewTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  showTransactionDetailsOnPress?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => unknown;
  onRefresh?: () => unknown;

  onTransactionsScrollEvent: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void;
}

interface SectionedTransaction {
  type: 'header' | 'transaction';
  title?: string;
  transaction?: Transaction;
}

const DAY_FORMAT = 'MMM DD, YYYY';

export const AccountTransactions = ({
  transactions,
  loading,
  showTransactionDetailsOnPress,
  isRefreshing,
  onRefresh,
  onEndReached,
  onTransactionsScrollEvent
}: ExplorerAccountViewTransactionsProps) => {
  const sectionizedTransactions: SectionedTransaction[] = React.useMemo(() => {
    const sectionMap = new Map<string, Transaction[]>();
    transactions.forEach((n) => {
      const key = moment(n.timestamp).format(DAY_FORMAT);
      const transactionsInSection = sectionMap.get(key) || [];
      transactionsInSection.push(n);
      sectionMap.set(key, transactionsInSection);
    });

    const sections: SectionedTransaction[] = [];
    for (const [title, data] of sectionMap.entries()) {
      sections.push({ type: 'header', title });
      data.forEach((transaction) => {
        sections.push({ type: 'transaction', transaction });
      });
    }
    return sections;
  }, [transactions]);

  const renderItem = (
    args: ListRenderItemInfo<SectionedTransaction>
  ): JSX.Element => {
    if (args.item.type === 'header') {
      return (
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={13}
          color={COLORS.neutral500}
        >
          {args.item.title}
        </Text>
      );
    }

    return (
      <ExplorerAccountTransactionItem
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        transaction={args.item.transaction!}
        disabled={showTransactionDetailsOnPress}
      />
    );
  };

  return (
    <>
      <Animated.FlatList
        keyExtractor={(item, idx) =>
          item.type === 'transaction'
            ? `${item.transaction?.hash}-${idx}`
            : `header-${idx}`
        }
        data={sectionizedTransactions}
        renderItem={renderItem}
        ListEmptyComponent={
          loading ? null : (
            <LocalizedRenderEmpty text={'common.no.transactions'} />
          )
        }
        ItemSeparatorComponent={() => <Spacer value={16} />}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
        testID="Transactions_List"
        ListFooterComponent={() =>
          loading && <CenteredSpinner containerStyle={styles.loader} />
        }
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={Boolean(isRefreshing)}
          />
        }
        onScroll={onTransactionsScrollEvent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingBottom: '60%'
  },
  loader: {
    marginTop: verticalScale(8)
  }
});
