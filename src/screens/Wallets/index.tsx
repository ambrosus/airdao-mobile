import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ethers } from 'ethers';
import {
  AccountActions,
  PaginatedAccountList,
  WalletDepositFunds,
  WalletTransactionsAndAssets
} from '@components/templates';
import { Spacer } from '@components/base';
import { useBalanceOfAddress, useWallet } from '@hooks';
import { scale, verticalScale } from '@utils/scaling';
import { useAllAccounts } from '@hooks/database';
import { ExplorerAccount } from '@models';
import { PaginationCircles } from '@components/composite';
import { COLORS } from '@constants/colors';
import { HomeHeader } from './components';
import { WalletUtils } from '@utils/wallet';
import { WalletCardHeight } from '@components/modular/WalletCard/styles';
import { useBridgeContextData } from '@features/bridge/context';
import { useFocusEffect } from '@react-navigation/native';

export const HomeScreen = () => {
  const { onChangeSelectedWallet } = useWallet();
  const { data: accounts } = useAllAccounts();
  const [scrollIdx, setScrollIdx] = useState(0);
  const selectedAccount = accounts.length > 0 ? accounts[scrollIdx] : null;
  const { data: selectedAccountBalance, refetch: refetchAmbBalance } =
    useBalanceOfAddress(selectedAccount?.address || '');

  const selectedAccountWithBalance = selectedAccount
    ? ExplorerAccount.fromDBModel(selectedAccount)
    : null;

  if (selectedAccountWithBalance) {
    selectedAccountWithBalance.ambBalance = Number(
      selectedAccountBalance.ether
    );
    selectedAccountWithBalance.ambBalanceWei = selectedAccountBalance.wei;
  }

  const { setSelectedAccount } = useBridgeContextData();

  useFocusEffect(
    useCallback(() => {
      WalletUtils.changeSelectedWallet(accounts[scrollIdx]?.wallet?.id);
      setSelectedAccount(accounts[scrollIdx]);
    }, [accounts, scrollIdx, setSelectedAccount])
  );

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[scrollIdx];
      WalletUtils.changeSelectedWallet(account?.wallet?.id);
      setSelectedAccount(account);
      onChangeSelectedWallet(account);
    }
  }, [accounts, onChangeSelectedWallet, scrollIdx, setSelectedAccount]);

  const isSelectAccountBalanceZero = useMemo(() => {
    return ethers.utils.parseEther(selectedAccountBalance.ether).isZero();
  }, [selectedAccountBalance.ether]);

  return (
    <SafeAreaView edges={['top']} testID="Home_Screen" style={{ flex: 1 }}>
      <HomeHeader />
      <Spacer value={verticalScale(24)} />
      <View style={{ flex: 1 }}>
        <PaginatedAccountList
          accounts={accounts}
          type="credit-card"
          listProps={{
            ItemSeparatorComponent: () => (
              <Spacer horizontal value={scale(16)} />
            ),
            contentContainerStyle: {
              paddingHorizontal: accounts?.length > 1 ? scale(16) : scale(38)
            },
            style: {
              flexGrow: 0,
              minHeight: WalletCardHeight
            }
          }}
          onScrolIndexChange={setScrollIdx}
        />
        {accounts.length > 1 && (
          <View style={{ alignSelf: 'center', marginTop: verticalScale(16) }}>
            <PaginationCircles
              totalCount={accounts.length}
              activeColor={COLORS.activeOrange}
              passiveColor={COLORS.neutral100}
              activeIndex={scrollIdx}
              size={verticalScale(10)}
              gap={scale(16)}
            />
          </View>
        )}
        {selectedAccountWithBalance && (
          <>
            <Spacer value={verticalScale(accounts.length > 1 ? 24 : 32)} />
            <AccountActions
              account={selectedAccountWithBalance}
              disabled={isSelectAccountBalanceZero}
            />
            <Spacer value={verticalScale(32)} />
            {isSelectAccountBalanceZero ? (
              <WalletDepositFunds />
            ) : (
              <WalletTransactionsAndAssets
                account={selectedAccountWithBalance}
                onRefresh={refetchAmbBalance}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
