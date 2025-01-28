import React, { forwardRef } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleProp,
  StyleSheet,
  ViewStyle
} from 'react-native';
import moment from 'moment';
import Animated from 'react-native-reanimated';
import { Spacer, Text } from '@components/base';
import { CenteredSpinner } from '@components/composite';
import { COLORS } from '@constants/colors';
import { Transaction } from '@models';
import { scale, verticalScale } from '@utils';
import { ExplorerAccountTransactionItem } from './components';
import { LocalizedRenderEmpty } from '../LocalizedRenderEmpty';

interface ExplorerAccountViewTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  showTransactionDetailsOnPress?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => unknown;
  onRefresh?: () => unknown;
  onTransactionsScrollEvent?: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void;
  containerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

interface SectionedTransaction {
  type: 'header' | 'transaction';
  title?: string;
  transaction?: Transaction;
}

const DAY_FORMAT = 'MMM DD, YYYY';

export const AccountTransactions = forwardRef<
  FlatList,
  ExplorerAccountViewTransactionsProps
>(
  (
    {
      transactions,
      loading,
      showTransactionDetailsOnPress,
      isRefreshing,
      onRefresh,
      onEndReached,
      onTransactionsScrollEvent,
      containerStyle,
      listStyle
    },
    ref
  ) => {
    const sectionizedTransactions: SectionedTransaction[] =
      React.useMemo(() => {
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
          ref={ref}
          keyExtractor={(item, idx) =>
            item.type === 'transaction'
              ? `${item.transaction?.hash}-${idx}`
              : `header-${idx}`
          }
          data={sectionizedTransactions}
          renderItem={renderItem}
          onScroll={onTransactionsScrollEvent}
          ListEmptyComponent={
            loading ? null : (
              <LocalizedRenderEmpty text={'common.no.transactions'} />
            )
          }
          ItemSeparatorComponent={() => <Spacer value={16} />}
          style={listStyle}
          contentContainerStyle={[styles.list, containerStyle]}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
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
        />
      </>
    );
  }
);

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
