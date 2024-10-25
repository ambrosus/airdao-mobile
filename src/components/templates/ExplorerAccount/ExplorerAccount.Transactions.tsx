import React from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  SectionList,
  SectionListData,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@models';
import { scale, verticalScale } from '@utils/scaling';
import { CenteredSpinner } from '@components/composite';
import { Spacer, Text } from '@components/base';

import { LocalizedRenderEmpty } from '../LocalizedRenderEmpty';
import { COLORS } from '@constants/colors';
import { ExplorerAccountTransactionItem } from './components';

interface ExplorerAccountViewTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  showTransactionDetailsOnPress?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => unknown;
  onRefresh?: () => unknown;
}

interface TransactionSection {
  title: string;
  data: Transaction[];
  index: number;
}
const DAY_FORMAT = 'MMM DD YYYY';

export const AccountTransactions = (
  props: ExplorerAccountViewTransactionsProps
): JSX.Element => {
  const {
    transactions,
    loading,
    showTransactionDetailsOnPress,
    isRefreshing,
    onRefresh,
    onEndReached
  } = props;
  const { t } = useTranslation();

  const sectionizedTransactions: TransactionSection[] = React.useMemo(() => {
    const sectionMap = new Map<string, Transaction[]>();
    transactions.forEach((n) => {
      const key = moment(n.timestamp).format(DAY_FORMAT);
      const transactionsInSection = sectionMap.get(key) || [];
      transactionsInSection.push(n);
      sectionMap.set(key, transactionsInSection);
    });
    const sections: TransactionSection[] = [];
    let index = 0;
    for (const [date, transactions] of sectionMap) {
      const today = moment().format(DAY_FORMAT);
      const yesterday = moment().subtract(1, 'day').format(DAY_FORMAT);
      const title =
        date === today
          ? t('common.today')
          : date === yesterday
          ? t('common.yesterday')
          : date;
      sections.push({ title, data: transactions, index });
      index++;
    }
    return sections;
  }, [transactions, t]);

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

  const renderSectionHeader = (info: {
    section: SectionListData<Transaction, TransactionSection>;
  }) => {
    return (
      <>
        {info.section.index !== 0 && (
          <>
            <Spacer value={verticalScale(40)} />
          </>
        )}
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {info.section.title.toUpperCase()}
        </Text>
        <Spacer value={verticalScale(16)} />
      </>
    );
  };

  return (
    <>
      <SectionList<Transaction, TransactionSection>
        keyExtractor={(item, idx) => `${item.hash}-${idx}`}
        sections={sectionizedTransactions}
        renderItem={renderTransaction}
        ListEmptyComponent={
          loading ? null : (
            <LocalizedRenderEmpty text={'common.no.transactions'} />
          )
        }
        ItemSeparatorComponent={() => <Spacer value={32} />}
        contentContainerStyle={styles.list}
        renderSectionHeader={renderSectionHeader}
        onEndReached={onEndReached}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        testID="Transactions_List"
        ListFooterComponent={() => (loading ? <CenteredSpinner /> : <></>)}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={Boolean(isRefreshing)}
          />
        }
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
