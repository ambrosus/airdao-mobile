import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Spinner } from '@components/base';
import { Transaction } from '@models';
import { SingleTransaction } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions/SingleTransaction';
import { LocalizedRenderEmpty } from '@components/templates';
import { useTranslation } from 'react-i18next';

interface WalletTransactionsProps {
  transactions: Transaction[] | undefined;
  loading: boolean;
  error?: boolean;
}

export const WalletTransactions = (
  props: WalletTransactionsProps
): JSX.Element => {
  const { transactions, loading, error } = props;

  const { t } = useTranslation();

  const renderTransactions = (
    args: ListRenderItemInfo<Transaction>
  ): JSX.Element => {
    return <SingleTransaction transaction={args.item} />;
  };

  return (
    <>
      {!transactions && error ? (
        <LocalizedRenderEmpty text={t('no.transactions.yet')} />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactions}
          ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
          contentContainerStyle={{
            paddingBottom: 100
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
};
