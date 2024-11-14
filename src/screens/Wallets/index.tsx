import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ethers } from 'ethers';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import {
  AccountActions,
  PaginatedAccountList,
  WalletTransactionsAndAssets
} from '@components/templates';
import { Spacer } from '@components/base';
import { useBalanceOfAddress, useWallet } from '@hooks';
import { scale, SCREEN_HEIGHT, verticalScale } from '@utils/scaling';
import { useAllAccounts } from '@hooks/database';
import { ExplorerAccount } from '@models';
import { HomeHeader } from './components';
import { WalletUtils } from '@utils/wallet';
import { WalletCardHeight } from '@components/modular/WalletCard/styles';

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

  const { wallet: setSelectedAccount } = useWallet();

  useFocusEffect(
    useCallback(() => {
      WalletUtils.changeSelectedWallet(accounts[scrollIdx]?.wallet?.id);
    }, [accounts, scrollIdx])
  );

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[scrollIdx];
      WalletUtils.changeSelectedWallet(account?.wallet?.id);
      onChangeSelectedWallet(account);
    }
  }, [accounts, onChangeSelectedWallet, scrollIdx, setSelectedAccount]);

  const isSelectAccountBalanceZero = useMemo(() => {
    return ethers.utils.parseEther(selectedAccountBalance.wei).isZero();
  }, [selectedAccountBalance.wei]);

  const offsetScrollY = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);

  const onTransactionsScrollEvent = useAnimatedScrollHandler((event) => {
    offsetScrollY.value = event.contentOffset.y;
  });

  const [headerHeight, setHeaderHeight] = useState(0);

  const hideThreshold = headerHeight + 24;

  const isHeaderHidden = useDerivedValue(() => {
    return offsetScrollY.value > hideThreshold / 4;
  });

  const animatedHeaderStyles = useAnimatedStyle(() => {
    const translateY = withSpring(isHeaderHidden.value ? -hideThreshold : 0, {
      damping: 20,
      stiffness: 90
    });
    const opacity = withSpring(isHeaderHidden.value ? 0 : 1, {
      damping: 20,
      stiffness: 90
    });

    return {
      zIndex: -999,
      transform: [{ translateY }],
      opacity
    };
  });

  const animatedListStyles = useAnimatedStyle(() => {
    const translateY = withSpring(isHeaderHidden.value ? -hideThreshold : 0, {
      damping: 20,
      stiffness: 90
    });

    const height = withSpring(
      isHeaderHidden.value ? SCREEN_HEIGHT : SCREEN_HEIGHT - hideThreshold,
      {
        damping: 20,
        stiffness: 90
      }
    );

    return {
      flex: activeTabIndex.value === 2 ? 0 : 1,
      height,
      transform: [{ translateY }]
    };
  });

  const onHeaderLayoutChange = useCallback(
    (event: LayoutChangeEvent) =>
      setHeaderHeight(event.nativeEvent.layout.height),
    []
  );

  const onChangeActiveTabIndex = useCallback(
    (index: number) => {
      activeTabIndex.value = index;
      offsetScrollY.value = 0;
    },
    [activeTabIndex, offsetScrollY]
  );

  return (
    <SafeAreaView edges={['top']} testID="Home_Screen" style={{ flex: 1 }}>
      <HomeHeader
        isHeaderHidden={isHeaderHidden}
        account={selectedAccountWithBalance}
      />
      <Spacer value={verticalScale(24)} />
      <Animated.View
        style={animatedHeaderStyles}
        onLayout={onHeaderLayoutChange}
      >
        <PaginatedAccountList
          accounts={accounts}
          type="credit-card"
          listProps={{
            ItemSeparatorComponent: () => (
              <Spacer horizontal value={scale(16)} />
            ),
            contentContainerStyle: {
              paddingHorizontal: accounts?.length > 1 ? scale(20) : scale(27)
            },
            style: {
              flexGrow: 0,
              minHeight: WalletCardHeight
            }
          }}
          onScrollIndexChange={setScrollIdx}
        />
        {selectedAccountWithBalance && (
          <>
            <Spacer value={verticalScale(accounts.length > 1 ? 24 : 32)} />
            <AccountActions
              account={selectedAccountWithBalance}
              disabled={isSelectAccountBalanceZero}
            />
            <Spacer value={verticalScale(16)} />
          </>
        )}
      </Animated.View>

      {selectedAccountWithBalance && (
        <Animated.View style={[animatedListStyles]}>
          <WalletTransactionsAndAssets
            onChangeActiveTabIndex={onChangeActiveTabIndex}
            onTransactionsScrollEvent={onTransactionsScrollEvent}
            account={selectedAccountWithBalance}
            onRefresh={refetchAmbBalance}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
