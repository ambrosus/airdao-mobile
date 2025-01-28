import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp, HomeParamsList } from '@appTypes';
import { Button, Row, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { ChartIcon } from '@components/svg/icons/v2';
import { AccountTransactions } from '@components/templates';
import { COLORS } from '@constants/colors';
import { AssetsAccountActionsList } from '@features/wallet-assets/components/modular';
import { useAMBPrice, useTokensAndTransactions, useUSDPrice } from '@hooks';
import { useTransactionsOfToken } from '@hooks/query/useTransactionsOfToken';
import {
  StringUtils,
  StringValidators,
  NumberUtils,
  scale,
  verticalScale
} from '@utils';
import { styles } from './styles';

export const AssetScreen = () => {
  const {
    params: { tokenInfo, walletAccount }
  } = useRoute<RouteProp<HomeParamsList, 'AssetScreen'>>();
  const navigation = useNavigation<HomeNavigationProp>();

  const { data: ambPriceData } = useAMBPrice();

  const {
    data: tokensAndTransactions,
    fetchNextPage: fetchNextPageAddress,
    loading: tokensAndTransactionsLoading,
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

  const percentChange24H = ambPriceData?.percentChange24H || 0;
  const usdPrice = useUSDPrice(tokenInfo.balance.ether || 0, tokenInfo.symbol);
  const isAMBToken = walletAccount === tokenInfo.address;
  const hasNextPage = isAMBToken ? hasNextPageOfAddress : hasNextPageOfToken;
  const fetchNextPage = isAMBToken ? fetchNextPageAddress : fetchNextPageToken;

  const navigateToAMBScreen = useCallback(
    () => navigation.navigate('AMBMarketScreen'),
    [navigation]
  );

  const tokenNameOrAddress = useMemo(() => {
    const { symbol, address } = tokenInfo;
    const isAddress = StringValidators.isStringAddress(symbol);

    if (symbol && !isAddress) {
      return symbol;
    }

    return StringUtils.formatAddress(address, 5, 6);
  }, [tokenInfo]);

  const renderHeaderTitleComponent = useMemo(
    () => (
      <Row alignItems="center">
        <View>
          <TokenLogo scale={0.7} token={tokenInfo.tokenNameFromDatabase} />
        </View>
        <Spacer horizontal value={scale(4)} />
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
        >
          {tokenNameOrAddress}
        </Text>
      </Row>
    ),
    [tokenNameOrAddress, tokenInfo.tokenNameFromDatabase]
  );

  const renderHeaderRightComponent = useMemo(
    () =>
      tokenInfo.name === 'AirDAO' && (
        <Button onPress={navigateToAMBScreen}>
          <ChartIcon color={COLORS.neutral500} />
        </Button>
      ),
    [navigateToAMBScreen, tokenInfo.name]
  );

  const isTransactionsLoading = useMemo(
    () => transactionsLoading || tokensAndTransactionsLoading,
    [tokensAndTransactionsLoading, transactionsLoading]
  );

  const txs = useMemo(
    () =>
      walletAccount === tokenInfo.address
        ? tokensAndTransactions.transactions
        : transactions,
    [
      tokenInfo.address,
      tokensAndTransactions.transactions,
      transactions,
      walletAccount
    ]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        style={styles.headerContentRightContainer}
        title={renderHeaderTitleComponent}
        contentRight={renderHeaderRightComponent}
      />
      <Spacer value={verticalScale(16)} />
      <View style={styles.innerContainer}>
        <View style={styles.accountDetails}>
          <Text
            fontSize={15}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral500}
          >
            {StringUtils.formatAddress(walletAccount, 5, 5)}
          </Text>

          <Text
            fontSize={22}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
            letterSpacing={-0.31}
          >
            {NumberUtils.numberToTransformedLocale(
              tokenInfo.balance.formattedBalance
            )}{' '}
            {tokenInfo.symbol}
          </Text>

          <Row style={styles.accountDetailsFooter} alignItems="center">
            {!Number.isNaN(usdPrice) && (
              <Text
                fontSize={16}
                fontFamily="Inter_500Medium"
                color={COLORS.neutral800}
              >
                ${NumberUtils.numberToTransformedLocale(usdPrice)}
              </Text>
            )}
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={percentChange24H > 0 ? COLORS.success400 : COLORS.error400}
            >
              {NumberUtils.addSignToNumber(percentChange24H)}% (24hr)
            </Text>
          </Row>
        </View>
        <View style={styles.actionsContainer}>
          <AssetsAccountActionsList address={walletAccount} token={tokenInfo} />
        </View>

        <View style={styles.transactions}>
          <AccountTransactions
            transactions={txs}
            listStyle={styles.transactionsList}
            containerStyle={styles.transactionsContainer}
            loading={isTransactionsLoading}
            onEndReached={() => hasNextPage && fetchNextPage()}
          />
          <Text>asdf</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
