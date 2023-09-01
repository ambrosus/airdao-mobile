import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Spinner } from '@components/base';
import { Transaction } from '@models';
import { SingleTransaction } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions/SingleTransaction';
import { LocalizedRenderEmpty } from '@components/templates';

interface WalletTransactionsProps {
  transactions: Transaction[];
  // loading: boolean;z
}

export const WalletTransactions = (
  props: WalletTransactionsProps
): JSX.Element => {
  const { transactions } = props;

  const renderTransactions = (
    args: ListRenderItemInfo<Transaction>
  ): JSX.Element => {
    return <SingleTransaction transaction={args.item} />;
  };

  return (
    <View>
      {transactions ? (
        <FlatList
          data={transactions}
          renderItem={renderTransactions}
          contentContainerStyle={{ paddingBottom: 60 }}
          // ListFooterComponent={() => (loading ? <Spinner /> : <></>)}
          ListFooterComponent={<View style={{ height: 400 }} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <LocalizedRenderEmpty text="No transactions yet" />
      )}
    </View>
  );
};
