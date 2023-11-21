import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimatedTabs } from '@components/modular';
import { ExplorerAccount } from '@models';
import { AccountTransactions } from '../ExplorerAccount';
import { WalletAssets } from './WalletAssets';
import { useTokensAndTransactions } from '@hooks';

interface WalletTransactionsAndAssetsProps {
  account: ExplorerAccount;
}

export const WalletTransactionsAndAssets = (
  props: WalletTransactionsAndAssetsProps
) => {
  const { account } = props;
  const {
    data: tokensAndTransactions,
    loading,
    fetchNextPage,
    hasNextPage,
    error
  } = useTokensAndTransactions(account.address, 1, 20, !!account.address);
  const { tokens, transactions } = tokensAndTransactions;

  const { t } = useTranslation();

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedTabs
        tabs={[
          {
            title: t('wallet.my.assets'),
            view: (
              <WalletAssets
                tokens={tokens}
                loading={loading}
                account={account}
                error={error}
              />
            )
          },
          {
            title: t('common.transactions'),
            view: (
              <AccountTransactions
                transactions={transactions}
                loading={loading}
                onEndReached={loadMoreTransactions}
              />
            )
          }
        ]}
        containerStyle={{ flex: 1 }}
      />
    </View>
  );
};
