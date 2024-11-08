import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { styles } from './styles';
import { AnimatedTabs } from '@components/modular';
import { ExplorerAccount } from '@models';
import { useTokensAndTransactions } from '@hooks';
import { AccountTransactions } from '../ExplorerAccount';
import { WalletAssets } from './WalletAssets';
import { WalletDepositFunds } from '../WalletDepositFunds';
import { Spinner } from '@components/base';

interface WalletTransactionsAndAssetsProps {
  account: ExplorerAccount;
  onRefresh?: () => void;
  onChangeActiveTabIndex: (index: number) => void;
  onTransactionsScrollEvent: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void;
}

export const WalletTransactionsAndAssets = ({
  account,
  onRefresh,
  onTransactionsScrollEvent,
  onChangeActiveTabIndex
}: WalletTransactionsAndAssetsProps) => {
  const { t } = useTranslation();

  const {
    data: tokensAndTransactions,
    loading,
    fetchNextPage,
    hasNextPage,
    refetch: refetchAssets,
    refetching,
    isFetchingNextPage,
    error
  } = useTokensAndTransactions(account.address, 1, 20, !!account.address);

  const transactionsHistoryListRef = useRef<FlatList>(null);
  const assetsListRef = useRef<FlatList>(null);

  const { tokens, transactions } = tokensAndTransactions;
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
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  const _onChangeActiveTabIndex = useCallback(
    (index: number) => {
      switch (index) {
        case 0: {
          transactionsHistoryListRef.current?.scrollToOffset({
            animated: true,
            offset: 0
          });
        }
        case 2: {
          assetsListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }
      }
      onChangeActiveTabIndex(index);
    },
    [onChangeActiveTabIndex]
  );

  const isSelectAccountBalanceZero = useMemo(() => {
    return ethers.utils.parseEther(account.ambBalanceWei).isZero();
  }, [account.ambBalanceWei]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Spinner />
      </View>
    );
  }

  if (!loading && isSelectAccountBalanceZero) {
    return <WalletDepositFunds onRefresh={onRefresh} />;
  }

  return (
    <View style={styles.container}>
      <AnimatedTabs
        containerStyle={styles.container}
        onChangedIndex={_onChangeActiveTabIndex}
        tabs={[
          {
            title: t('wallet.my.assets'),
            view: (
              <WalletAssets
                ref={assetsListRef}
                tokens={tokens}
                loading={isFetchingNextPage}
                account={account}
                error={error}
                onRefresh={_onRefresh}
                isRefreshing={refetching && userPerformedRefresh}
              />
            )
          },
          {
            title: 'NFTs',
            view: <View />
          },
          {
            title: t('kosmos.market.tabs.history'),
            view: (
              <AccountTransactions
                ref={transactionsHistoryListRef}
                onTransactionsScrollEvent={onTransactionsScrollEvent}
                transactions={transactions}
                loading={isFetchingNextPage}
                isRefreshing={refetching && userPerformedRefresh}
                onEndReached={loadMoreTransactions}
                onRefresh={_onRefresh}
              />
            )
          }
        ]}
      />
    </View>
  );
};
