import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { DerivedValue } from 'react-native-reanimated';
import { Spinner } from '@components/base';
import { AnimatedTabs } from '@components/modular';
import { _tokensOrNftMapper } from '@entities/wallet';
import { balanceReducer } from '@features/wallet-assets/utils';
import { useTokensAndTransactions } from '@hooks';
import { ExplorerAccount } from '@models';
import { styles } from './styles';
import { AccountTransactions } from '../ExplorerAccount';
import { NftAssets } from './NftAssets';
import { WalletAssets } from './WalletAssets';
import { WalletDepositFunds } from '../WalletDepositFunds';

interface WalletTransactionsAndAssetsProps {
  account: ExplorerAccount;
  onRefresh?: () => void;
  onChangeActiveTabIndex: (index: number) => void;
  activeTabIndex: DerivedValue<number>;
  onTransactionsScrollEvent: (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => void;
}

export const WalletTransactionsAndAssets = ({
  account,
  onRefresh,
  activeTabIndex,
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

  const _onRefresh = useCallback(() => {
    setUserPerformedRefresh(true);
    if (typeof refetchAssets === 'function') {
      refetchAssets();
    }
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  }, [onRefresh, refetchAssets]);

  useFocusEffect(
    useCallback(() => {
      if (typeof refetchAssets === 'function') {
        refetchAssets();
      }
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    }, [onRefresh, refetchAssets])
  );

  const tokensOrNFTs = useMemo(() => {
    return _tokensOrNftMapper(tokens);
  }, [tokens]);

  const _onChangeActiveTabIndex = useCallback(
    (index: number) => {
      if (activeTabIndex.value === index) return;

      switch (index) {
        case 0: {
          transactionsHistoryListRef.current?.scrollToOffset({
            animated: true,
            offset: 0
          });
          break;
        }
        case 1: {
          transactionsHistoryListRef.current?.scrollToOffset({
            animated: true,
            offset: 0
          });
          assetsListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          break;
        }
        case 2: {
          assetsListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          break;
        }
      }
      onChangeActiveTabIndex(index);
    },
    [activeTabIndex.value, onChangeActiveTabIndex]
  );

  const isSelectAccountBalanceZero = useMemo(() => {
    return balanceReducer(tokensOrNFTs.tokens, account.ambBalanceWei).isZero();
  }, [account.ambBalanceWei, tokensOrNFTs.tokens]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Spinner />
      </View>
    );
  }

  if (!loading && isSelectAccountBalanceZero) {
    return <WalletDepositFunds refetch={_onRefresh} loading={refetching} />;
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
                tokens={tokensOrNFTs.tokens}
                loading={isFetchingNextPage}
                account={account}
                error={error}
                onRefresh={_onRefresh}
                isRefreshing={refetching && userPerformedRefresh}
              />
            )
          },
          {
            title: t('wallets.nfts'),
            view: (
              <NftAssets
                nfts={tokensOrNFTs.nfts}
                loading={isFetchingNextPage}
                onRefresh={_onRefresh}
                isRefreshing={refetching && userPerformedRefresh}
              />
            )
          },
          {
            title: t('wallet.history'),
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
