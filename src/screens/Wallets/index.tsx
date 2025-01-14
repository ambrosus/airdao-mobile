import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, LayoutChangeEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ethers } from 'ethers';
import Constants from 'expo-constants';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  cancelAnimation
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer } from '@components/base';
import { WalletCardHeight } from '@components/modular/WalletCard/styles';
import {
  AccountActions,
  PaginatedAccountList,
  WalletTransactionsAndAssets
} from '@components/templates';
import { useCurrenciesQuery } from '@entities/currencies/lib';
import { useWalletStore } from '@entities/wallet';
import { useSendFundsStore } from '@features/send-funds';
import { HomeHeader } from '@features/wallet-assets/components/templates';
import { useBalanceOfAddress } from '@hooks';
import { useAllAccounts } from '@hooks/database';
import { ExplorerAccount } from '@models';
import { WalletUtils, scale, SCREEN_HEIGHT, verticalScale } from '@utils';

Alert.alert(
  'envs | home screen',
  JSON.stringify(Constants.expoConfig?.extra?.eas)
);

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 120,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01
} as const;

const SCROLL_RESET_THRESHOLD = 32;

export const HomeScreen = () => {
  const { setWallet } = useWalletStore();
  const { tokens: _sendFundsTokens, onSetTokens } = useSendFundsStore();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollIdx, setScrollIdx] = useState(0);

  const hideThreshold = headerHeight + 24;
  const hideThresholdQuarter = hideThreshold / 4;

  const offsetScrollY = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);

  const { data: accounts } = useAllAccounts();
  const selectedAccount = accounts.length > 0 ? accounts[scrollIdx] : null;
  const { data: selectedAccountBalance, refetch: refetchAmbBalance } =
    useBalanceOfAddress(selectedAccount?.address || '');
  const { onRefetchCurrenciesList } = useCurrenciesQuery();

  const onMultiplyRefetchAction = useCallback(() => {
    onRefetchCurrenciesList();
    if (typeof refetchAmbBalance === 'function') refetchAmbBalance();
  }, [onRefetchCurrenciesList, refetchAmbBalance]);

  const selectedAccountWithBalance = selectedAccount
    ? ExplorerAccount.fromDBModel(selectedAccount)
    : null;

  if (selectedAccountWithBalance) {
    selectedAccountWithBalance.ambBalance = Number(
      selectedAccountBalance.ether
    );
    selectedAccountWithBalance.ambBalanceWei = selectedAccountBalance.wei;
  }

  useFocusEffect(
    useCallback(() => {
      WalletUtils.changeSelectedWallet(accounts[scrollIdx]?.wallet?.id);
    }, [accounts, scrollIdx])
  );

  useEffect(() => {
    if (_sendFundsTokens.length > 0) onSetTokens([]);

    if (accounts.length > 0) {
      const account = accounts[scrollIdx];
      WalletUtils.changeSelectedWallet(account?.wallet?.id);
      setWallet(account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, onSetTokens, scrollIdx, setWallet]);

  const isSelectAccountBalanceZero = useMemo(() => {
    return ethers.utils.parseEther(selectedAccountBalance.wei).isZero();
  }, [selectedAccountBalance.wei]);

  const onTransactionsScrollEvent = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { y: scrollY } = event.contentOffset;

      if (scrollY <= SCROLL_RESET_THRESHOLD) {
        cancelAnimation(offsetScrollY);
        offsetScrollY.value = 0;
      } else if (scrollY > hideThreshold) {
        offsetScrollY.value = scrollY;
      } else if (scrollY === headerHeight - 16) {
        offsetScrollY.value = scrollY + SCROLL_RESET_THRESHOLD;
      }
    },
    onMomentumEnd: (event) => {
      if (event.contentOffset.y < SCROLL_RESET_THRESHOLD) {
        cancelAnimation(offsetScrollY);
        offsetScrollY.value = withSpring(0, SPRING_CONFIG);
      }
    },
    onBeginDrag: () => {
      cancelAnimation(offsetScrollY);
    }
  });

  const isHeaderHidden = useDerivedValue(() => {
    return offsetScrollY.value > hideThresholdQuarter;
  }, [hideThresholdQuarter]);

  const translateY = useDerivedValue(() => {
    'worklet';
    return withSpring(isHeaderHidden.value ? -hideThreshold : 0, SPRING_CONFIG);
  }, [hideThreshold]);

  const headerOpacity = useDerivedValue(() => {
    'worklet';
    return withSpring(isHeaderHidden.value ? 0 : 1, SPRING_CONFIG);
  });

  const listHeight = useDerivedValue(() => {
    'worklet';
    return withTiming(
      isHeaderHidden.value ? SCREEN_HEIGHT : SCREEN_HEIGHT - hideThreshold,
      { duration: 1, easing: Easing.exp }
    );
  }, [hideThreshold]);

  const animatedHeaderStyles = useAnimatedStyle(() => {
    return {
      zIndex: -999999,
      transform: [{ translateY: translateY.value }],
      opacity: headerOpacity.value
    };
  }, []);

  const animatedListStyles = useAnimatedStyle(() => {
    return {
      flex: activeTabIndex.value === 2 ? 0 : 1,
      height: listHeight.value,
      transform: [{ translateY: translateY.value }]
    };
  }, []);

  const onHeaderLayoutChange = useCallback(
    (event: LayoutChangeEvent) =>
      setHeaderHeight(event.nativeEvent.layout.height),
    []
  );

  const onChangeActiveTabIndex = useCallback(
    (index: number) => {
      cancelAnimation(offsetScrollY);
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
              disabled={isSelectAccountBalanceZero && !isHeaderHidden.value}
            />
            <Spacer value={verticalScale(16)} />
          </>
        )}
      </Animated.View>

      {selectedAccountWithBalance && (
        <Animated.View style={[animatedListStyles]}>
          <WalletTransactionsAndAssets
            activeTabIndex={activeTabIndex}
            onChangeActiveTabIndex={onChangeActiveTabIndex}
            onTransactionsScrollEvent={onTransactionsScrollEvent}
            account={selectedAccountWithBalance}
            onRefresh={onMultiplyRefetchAction}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};
