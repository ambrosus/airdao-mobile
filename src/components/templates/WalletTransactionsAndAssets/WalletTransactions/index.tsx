import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Spinner } from '@components/base';
import { Transaction } from '@models';
import { SingleTransaction } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions/SingleTransaction';
import { LocalizedRenderEmpty } from '@components/templates';

interface WalletTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export const WalletTransactions = (
  props: WalletTransactionsProps
): JSX.Element => {
  const { transactions, loading } = props;
  const renderTransactions = (
    args: ListRenderItemInfo<Transaction>
  ): JSX.Element => {
    return <SingleTransaction transaction={args.item} />;
  };

  return (
    <View>
      {!transactions ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactions}
          ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
        />
      ) : (
        <LocalizedRenderEmpty text="No transactions yet" />
      )}
    </View>
  );
};
