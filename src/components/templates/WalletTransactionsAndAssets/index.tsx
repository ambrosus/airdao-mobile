import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AnimatedTabs } from '@components/modular';
import { ExplorerAccount } from '@models';
import { useTokensAndTransactions } from '@hooks';
import { AccountTransactions } from '../ExplorerAccount';
import { WalletAssets } from './WalletAssets';

interface WalletTransactionsAndAssetsProps {
  account: ExplorerAccount;
  onRefresh?: () => void;
}

export const WalletTransactionsAndAssets = (
  props: WalletTransactionsAndAssetsProps
) => {
  const { account, onRefresh } = props;
  const {
    data: tokensAndTransactions,
    loading,
    fetchNextPage,
    hasNextPage,
    refetch: refetchAssets,
    refetching,
    error
  } = useTokensAndTransactions(account.address, 1, 20, !!account.address);
  const { tokens, transactions } = tokensAndTransactions;
  const [userPerformedRefresh, setUserPerformedRefresh] = useState(false);

  useEffect(() => {
    if (!refetching) setUserPerformedRefresh(false);
  }, [refetching]);

  const { t } = useTranslation();

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const _onRefresh = () => {
    setUserPerformedRefresh(true);
    if (typeof refetchAssets === 'function') {
      refetchAssets();
    }
    if (typeof onRefresh === 'function') {
      onRefresh();
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
                onRefresh={_onRefresh}
                isRefreshing={refetching && userPerformedRefresh}
              />
            )
          },
          {
            title: t('common.transactions'),
            view: (
              <AccountTransactions
                transactions={transactions}
                loading={loading}
                isRefreshing={refetching && userPerformedRefresh}
                onEndReached={loadMoreTransactions}
                onRefresh={_onRefresh}
              />
            )
          }
        ]}
        containerStyle={{ flex: 1 }}
      />
    </View>
  );
};
