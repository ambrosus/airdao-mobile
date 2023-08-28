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
import { SingleAsset } from '@components/templates/WalletTransactionsAndAssets/WalletAssets/SingleAsset';
import { styles } from '@components/templates/WalletTransactionsAndAssets/styles';
import { WalletTransactions } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions';
import {
  useCryptoAccountFromHash,
  useSelectedWalletHash,
  useTransactionsOfAccount
} from '@hooks';
import { useTranslation } from 'react-i18next';
import { SingleTransaction } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions/SingleTransaction';
import { WalletAssets } from '@components/templates/WalletTransactionsAndAssets/WalletAssets';

interface WalletTransactionsAndAssetsProps {
  address: string;
}

export const WalletTransactionsAndAssets = (
  props: WalletTransactionsAndAssetsProps
) => {
  const { address } = props;
  const scrollView = useRef<ScrollView>(null);
  const selectedWalletHash = useSelectedWalletHash();
  const { data: account, loading: accountLoading } =
    useCryptoAccountFromHash(selectedWalletHash);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { t } = useTranslation();

  const initialMount = useRef(true);
  const TRANSACTION_LIMIT = 20;
  const { data: transactions, loading: transactionsLoading } =
    useTransactionsOfAccount(
      address,
      1,
      TRANSACTION_LIMIT,
      '',
      !initialMount.current
    );
  initialMount.current = false;

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
            color={currentIndex === 0 ? COLORS.blue500 : '#0e0e0e99'}
            fontSize={16}
          >
            {t('my.assets')}
          </Text>
        </Button>
        <View>
          <Button onPress={scrollToAssets} style={styles.tabRightTitle}>
            <Text
              fontFamily="Inter_500Medium"
              color={currentIndex === 0 ? '#0e0e0e99' : COLORS.blue500}
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
              backgroundColor: 'blue'
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
      >
        <View style={{ width: tabWidth }}>
          <SingleAsset asset={account} />
          {/*<WalletAssets assets={account} loading={accountLoading} />*/}
        </View>
        <View style={{ width: tabWidth }}>
          <WalletTransactions
            transactions={transactions}
            loading={transactionsLoading}
          />
          {/*<SingleTransaction />*/}
        </View>
      </ScrollView>
    </View>
  );
};