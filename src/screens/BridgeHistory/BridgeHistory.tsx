import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountTransactions } from '@components/templates';
import { useTokensAndTransactions } from '@hooks';
import { Header } from '@components/composite';
import { View } from 'react-native';
import { COLORS } from '@constants/colors';

export const BridgeHistory = () => {
  const account = {
    _id: 'gHs4w6rwyW5gjCMR',
    address: '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
    ambBalance: 1170.999,
    name: '',
    transactionCount: 0,
    type: 'account'
  };
  const {
    data: tokensAndTransactions,
    loading,
    fetchNextPage,
    hasNextPage,
    refetch: refetchAssets,
    refetching
  } = useTokensAndTransactions(account.address, 1, 20, !!account.address);
  const { transactions } = tokensAndTransactions;
  const [userPerformedRefresh, setUserPerformedRefresh] = useState(false);

  useEffect(() => {
    if (!refetching) setUserPerformedRefresh(false);
  }, [refetching]);

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
  };

  return (
    <SafeAreaView>
      <Header
        closeIconVisible={true}
        title="Transaction history"
        backIconVisible={false}
        style={{ shadowColor: 'transparent' }}
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: COLORS.neutral900Alpha['5'],
          marginBottom: 15
        }}
      />
      <AccountTransactions
        isBridge
        transactions={transactions}
        loading={loading}
        isRefreshing={refetching && userPerformedRefresh}
        onEndReached={loadMoreTransactions}
        onRefresh={_onRefresh}
      />
    </SafeAreaView>
  );
};
