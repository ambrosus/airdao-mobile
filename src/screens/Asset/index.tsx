import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeParamsList, HomeNavigationProp } from '@appTypes';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { StatisticsLogo } from '@components/svg/icons/Statistics';
import { scale, verticalScale } from '@utils/scaling';
import { useTokensAndTransactions, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { useTransactionsOfToken } from '@hooks/query/useTransactionsOfToken';
import { AccountActions, AccountTransactions } from '@components/templates';
import { TokenLogo } from '@components/modular';

export const AssetScreen = () => {
  const {
    params: { tokenInfo, walletAccount }
  } = useRoute<RouteProp<HomeParamsList, 'AssetScreen'>>();
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const usdPrice = useUSDPrice(tokenInfo.balance.ether || 0, tokenInfo.symbol);
  const isAMBToken = walletAccount === tokenInfo.address;

  const {
    data: tokensAndTransactions,
    fetchNextPage: fetchNextPageAddresss,
    hasNextPage: hasNextPageOfAddress
  } = useTokensAndTransactions(
    walletAccount,
    1,
    20,
    !!walletAccount && walletAccount === tokenInfo.address
  );

  const {
    data: transactions,
    loading: transactionsLoading,
    fetchNextPage: fetchNextPageToken,
    hasNextPage: hasNextPageOfToken
  } = useTransactionsOfToken(
    walletAccount,
    tokenInfo.address,
    1,
    20,
    !!walletAccount &&
      !!tokenInfo.address &&
      walletAccount !== tokenInfo.address
  );

  const hasNextPage = isAMBToken ? hasNextPageOfAddress : hasNextPageOfToken;
  const fetchNextPage = isAMBToken ? fetchNextPageAddresss : fetchNextPageToken;

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  const headerTitle =
    tokenInfo.name === ''
      ? 'Hera pool token'
      : tokenInfo.name === 'AirDAO'
      ? 'AirDAO (AMB)'
      : tokenInfo.symbol || tokenInfo.address;

  return (
    <View style={{ top }}>
      <Header
        title={
          <>
            <Row alignItems="center">
              <View style={{ transform: [{ scale: 0.75 }] }}>
                <TokenLogo token={tokenInfo.name} />
              </View>
              <Spacer horizontal value={scale(4)} />
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.neutral800}
              >
                {headerTitle}
              </Text>
            </Row>
          </>
        }
        contentRight={
          tokenInfo.name === 'AirDAO' && (
            <>
              <Button onPress={navigateToAMBScreen}>
                <StatisticsLogo />
              </Button>
            </>
          )
        }
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={verticalScale(16)} />
      <View style={{ alignItems: 'center' }}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.neutral300}
        >
          {t('asset.your.balance')}
        </Text>
        <Row alignItems="center">
          <Text
            fontFamily="Inter_700Bold"
            fontWeight="900"
            fontSize={24}
            color={COLORS.neutral900}
          >
            {tokenInfo.balance.ether < 1000
              ? NumberUtils.limitDecimalCount(tokenInfo.balance.ether, 2)
              : NumberUtils.abbreviateNumber(tokenInfo.balance.ether)}{' '}
            {tokenInfo.symbol}
          </Text>
          <Spacer horizontal value={scale(8)} />
          <Badge
            icon={
              <Text
                fontFamily="Inter_500Medium"
                fontSize={12}
                color={COLORS.neutral800}
              >
                ${NumberUtils.limitDecimalCount(usdPrice, 2)}
              </Text>
            }
            color={COLORS.gray300}
          />
        </Row>
      </View>
      <Spacer value={verticalScale(24)} />
      <AccountActions address={walletAccount} />
      <Spacer value={verticalScale(24)} />
      <View style={{ height: 1, backgroundColor: COLORS.neutral100 }} />
      <Spacer value={verticalScale(24)} />
      <View style={{ paddingHorizontal: scale(16) }}>
        <Text
          fontFamily="Inter_700Bold"
          fontSize={20}
          color={COLORS.neutral800}
        >
          {t('common.transactions')}
        </Text>
      </View>
      <View style={{ height: '80%', paddingTop: verticalScale(16) }}>
        <AccountTransactions
          transactions={
            walletAccount === tokenInfo.address
              ? tokensAndTransactions.transactions
              : transactions
          }
          loading={transactionsLoading}
          onEndReached={() => hasNextPage && fetchNextPage()}
        />
      </View>
    </View>
  );
};
