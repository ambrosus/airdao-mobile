import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { styles } from '@components/templates/WalletTransactionsAndAssets/styles';
import { WalletTransactions } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions';
import { useTranslation } from 'react-i18next';
import { WalletAssets } from '@components/templates/WalletTransactionsAndAssets/WalletAssets';
import { ExplorerAccount, Transaction } from '@models';

interface WalletTransactionsAndAssetsProps {
  transactions: Transaction[] | undefined;
  account: ExplorerAccount;
  tokens:
    | {
        address: string;
        name: string;
        balance: { wei: string; ether: number };
      }[]
    | undefined;
  loading: boolean;
  error: boolean;
}

export const WalletTransactionsAndAssets = (
  props: WalletTransactionsAndAssetsProps
) => {
  const { tokens, transactions, loading, account, error } = props;
  const scrollView = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { t } = useTranslation();

  const tabWidth = Dimensions.get('window').width;

  const indicatorPosition = useSharedValue(0);

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

  return (
    <View>
      <Row alignItems="center" justifyContent="space-between">
        <Button onPress={scrollToTransactions} style={styles.tabLeftTitle}>
          <Text
            fontFamily="Inter_500Medium"
            color={currentIndex === 0 ? COLORS.brand500 : COLORS.midnight}
            fontSize={16}
          >
            {t('my.assets')}
          </Text>
        </Button>
        <View>
          <Button onPress={scrollToAssets} style={styles.tabRightTitle}>
            <Text
              fontFamily="Inter_500Medium"
              color={currentIndex === 0 ? COLORS.midnight : COLORS.brand500}
              fontSize={16}
            >
              {t('transactions')}
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: '100%' }}
      >
        <View style={{ width: tabWidth }}>
          <WalletAssets
            tokens={tokens}
            loading={loading}
            account={account}
            error={error}
          />
        </View>
        <View style={{ width: tabWidth, height: '100%' }}>
          <WalletTransactions
            transactions={transactions}
            loading={loading}
            error={error}
          />
        </View>
      </ScrollView>
    </View>
  );
};
