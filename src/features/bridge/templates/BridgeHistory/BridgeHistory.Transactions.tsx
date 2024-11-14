import React, { useCallback, useMemo } from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  SectionList,
  SectionListData
} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import { styles } from './styles';
import { LocalizedRenderEmpty } from '@components/templates';
import { Spacer, Text } from '@components/base';
import { CenteredSpinner } from '@components/composite';
import { useBridgeHistory } from '../../../../hooks/query/useBridgeHistory';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { parseBridgeTransaction } from '@lib/bridgeSDK/bridgeFunctions/parseBridgeTransaction';
import { BridgeTransaction } from '@features/bridge/templates/BridgeTransaction';

interface TransactionSection {
  title: string;
  data: BridgeTransactionHistoryDTO[];
  index: number;
}
const DAY_FORMAT = 'MMM DD YYYY';

export const BridgeHistoryTransactions = () => {
  const { t } = useTranslation();
  const {
    data: transactions,
    loading,
    refetch: refetchAssets,
    refetching
  } = useBridgeHistory();

  const renderSectionHeader = (info: {
    section: SectionListData<BridgeTransactionHistoryDTO, TransactionSection>;
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

  const sortedTxs = useMemo(() => {
    return transactions
      .sort((a, b) => b.timestampStart - a.timestampStart)
      .map((item) => parseBridgeTransaction(item));
  }, [transactions]);

  const sectionizedTransactions: TransactionSection[] = React.useMemo(() => {
    const sectionMap = new Map<string, BridgeTransactionHistoryDTO[]>();
    sortedTxs.forEach((n) => {
      const key = moment(n.timestampStart * 1000).format(DAY_FORMAT);
      const transactionsInSection = sectionMap.get(key) || [];
      transactionsInSection.push(n);
      sectionMap.set(key, transactionsInSection);
    });
    const sections: TransactionSection[] = [];
    let index = 0;
    for (const [date, sortedTxs] of sectionMap) {
      const today = moment().format(DAY_FORMAT);
      const yesterday = moment().subtract(1, 'day').format(DAY_FORMAT);
      const title =
        date === today
          ? t('common.today')
          : date === yesterday
          ? t('common.yesterday')
          : date;
      sections.push({ title, data: sortedTxs, index });
      index++;
    }
    return sections;
  }, [sortedTxs, t]);

  const renderListHistoryItem = useCallback(
    (args: ListRenderItemInfo<BridgeTransactionHistoryDTO>) => (
      <BridgeTransaction key={args.item.eventId} transaction={args.item} />
    ),
    []
  );

  if (refetching) {
    return <CenteredSpinner containerStyle={styles.spinner} />;
  }

  return (
    <SectionList<BridgeTransactionHistoryDTO, TransactionSection>
      keyExtractor={(item, idx) => `${item.withdrawTx}-${idx}`}
      sections={sectionizedTransactions}
      renderItem={renderListHistoryItem}
      ListEmptyComponent={
        loading ? null : (
          <LocalizedRenderEmpty text={'common.no.transactions'} />
        )
      }
      ItemSeparatorComponent={() => <Spacer value={32} />}
      contentContainerStyle={styles.list}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      testID="Transactions_List"
      refreshControl={
        <RefreshControl onRefresh={refetchAssets} refreshing={false} />
      }
    />
  );
};
