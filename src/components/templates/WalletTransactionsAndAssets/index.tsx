import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { ExplorerAccount } from '@models';
import { AccountTransactions } from '../ExplorerAccount';
import { WalletAssets } from './WalletAssets';
import { useTokensAndTransactions } from '@hooks';
import { AirDAOEventType, AirDAOFundsSentFromAppEventPayload } from '@appTypes';
import { AirDAOEventDispatcher } from '@lib';
import { styles } from './styles';

interface WalletTransactionsAndAssetsProps {
  account: ExplorerAccount;
}

export const WalletTransactionsAndAssets = (
  props: WalletTransactionsAndAssetsProps
) => {
  const { account } = props;
  const scrollView = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const { t } = useTranslation();

  const tabWidth = Dimensions.get('window').width;

  const indicatorPosition = useSharedValue(0);

  useEffect(() => {
    const onUserMadeTransaction = (
      data: AirDAOFundsSentFromAppEventPayload
    ) => {
      if (
        (data.from == account.address || data.to === account.address) &&
        typeof refetchAssets == 'function'
      ) {
        refetchAssets();
      }
    };
    const localTransactionListenter = AirDAOEventDispatcher.subscribe(
      AirDAOEventType.FundsSentFromApp,
      (payload) =>
        onUserMadeTransaction(payload as AirDAOFundsSentFromAppEventPayload)
    );
    return () => localTransactionListenter.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]);

  // @ts-ignore
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(indicatorPosition.value) }]
    };
  });

  useEffect(() => {
    indicatorPosition.value = withTiming(currentIndex * (tabWidth / 2), {
      duration: 0
    });
  }, [currentIndex, indicatorPosition, tabWidth]);

  const scrollToTransactions = () => {
    scrollView.current?.scrollTo({ x: 0, animated: true });
    setCurrentIndex(0);
    indicatorPosition.value = withTiming(0);
  };

  const scrollToAssets = () => {
    scrollView.current?.scrollTo({ x: tabWidth, animated: true });
    setCurrentIndex(1);
    indicatorPosition.value = withTiming(tabWidth / 2);
  };

  const loadMoreTransactions = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Row alignItems="center" justifyContent="space-between">
        <Button onPress={scrollToTransactions} style={styles.tabLeftTitle}>
          <Text
            fontFamily="Inter_500Medium"
            color={currentIndex === 0 ? COLORS.brand500 : COLORS.midnight}
            fontSize={16}
          >
            {t('wallet.my.assets')}
          </Text>
        </Button>
        <View>
          <Button onPress={scrollToAssets} style={styles.tabRightTitle}>
            <Text
              fontFamily="Inter_500Medium"
              color={currentIndex === 0 ? COLORS.midnight : COLORS.brand500}
              fontSize={16}
            >
              {t('common.transactions')}
            </Text>
          </Button>
        </View>
      </Row>
      <Spacer value={verticalScale(12)} />
      <View style={styles.tabsIndicator}>
        <Animated.View
          style={[
            {
              position: 'relative',
              bottom: 1,
              left: 0,
              width: tabWidth / 2,
              height: 2,
              backgroundColor: COLORS.brand500
            },
            indicatorStyle
          ]}
        />
      </View>
      <Spacer value={verticalScale(10)} />
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const scrollOffsetX = event.nativeEvent.contentOffset.x;
          setCurrentIndex(scrollOffsetX > 0 ? 1 : 0);
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            onRefresh={refetchAssets}
            refreshing={Boolean(refetching)}
          />
        }
      >
        <View style={{ width: tabWidth, flex: 1 }}>
          <WalletAssets
            tokens={tokens}
            loading={loading}
            account={account}
            error={error}
          />
        </View>
        <View
          style={{
            width: tabWidth,
            flex: 1
          }}
        >
          <AccountTransactions
            transactions={transactions}
            loading={loading}
            onEndReached={loadMoreTransactions}
          />
        </View>
      </ScrollView>
    </View>
  );
};
