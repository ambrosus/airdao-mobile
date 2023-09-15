import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PaginatedAccountList,
  WalletTransactionsAndAssets
} from '@components/templates';
import { Spacer } from '@components/base';
import { useBalanceOfAddress, useTokensAndTransactions } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { useAllAccounts } from '@hooks/database';
import { ExplorerAccount } from '@models';
import { PaginationCircles } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AccountActions, HomeHeader } from './components';

export const HomeScreen = () => {
  const { data: accounts } = useAllAccounts();
  const [scrollIdx, setScrollIdx] = useState(0);
  const selectedAccount = accounts.length > 0 ? accounts[scrollIdx] : null;
  const { data: selectedAccountBalance } = useBalanceOfAddress(
    selectedAccount?.address || ''
  );

  const account = selectedAccount
    ? ExplorerAccount.fromDBModel(selectedAccount)
    : null;

  if (account) {
    account.ambBalance = Number(selectedAccountBalance.ether);
  }

  const {
    data: tokensAndTransactions,
    loading,
    error
  } = useTokensAndTransactions(account?.address);

  return (
    <SafeAreaView edges={['top']} testID="Home_Screen" style={{ flex: 1 }}>
      <HomeHeader />
      <Spacer value={verticalScale(24)} />
      <View style={{ flex: 1 }}>
        <PaginatedAccountList
          accounts={accounts}
          horizontal={true}
          type="credit-card"
          listProps={{
            ItemSeparatorComponent: () => (
              <Spacer value={scale(16)} horizontal />
            ),
            contentContainerStyle: {
              paddingHorizontal: scale(16)
            },
            style: {
              flexGrow: 0,
              minHeight: verticalScale(172)
            }
          }}
          onScrolIndexChange={setScrollIdx}
        />
        {accounts.length > 1 && (
          <View style={{ alignSelf: 'center', marginTop: verticalScale(16) }}>
            <PaginationCircles
              totalCount={accounts.length}
              activeColor={COLORS.neutral500}
              passiveColor={COLORS.neutral100}
              activeIndex={scrollIdx}
              size={verticalScale(10)}
              gap={scale(16)}
            />
          </View>
        )}
        {account && (
          <>
            <Spacer value={verticalScale(accounts.length > 1 ? 24 : 32)} />
            <AccountActions address={account.address} />
            <Spacer value={verticalScale(32)} />
            <WalletTransactionsAndAssets
              account={account}
              transactions={tokensAndTransactions?.transactions}
              tokens={tokensAndTransactions?.tokens}
              loading={loading}
              error={error}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
