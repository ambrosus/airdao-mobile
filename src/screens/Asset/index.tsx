import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeParamsList, HomeNavigationProp } from '@appTypes';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { StatisticsLogo } from '@components/svg/icons/Statistics';
import { View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { LogoGradientCircular } from '@components/svg/icons';
import { useTranslation } from 'react-i18next';
import { useTokensAndTransactions, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { useTransactionsOfToken } from '@hooks/query/useTransactionsOfToken';
import { AccountTransactions } from '@components/templates';

export const AssetScreen = () => {
  const {
    params: { tokenInfo, walletAccount }
  } = useRoute<RouteProp<HomeParamsList, 'AssetScreen'>>();
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const usdPrice = useUSDPrice(tokenInfo.balance.ether || 0);

  const { data: tokensAndTransactions } = useTokensAndTransactions(
    walletAccount,
    1,
    20,
    !!walletAccount
  );

  const { data: transactions, loading } = useTransactionsOfToken(
    walletAccount,
    tokenInfo.address
  );

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  return (
    <View style={{ top }}>
      <Header
        title={
          <>
            <Row alignItems="center">
              <LogoGradientCircular />
              <Spacer horizontal value={scale(4)} />
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.neutral800}
              >
                {tokenInfo.name === ''
                  ? 'Hera pool token'
                  : tokenInfo.name || tokenInfo.address}
              </Text>
            </Row>
          </>
        }
        contentRight={
          tokenInfo.name === 'AMB' && (
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
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color="#A1A6B2">
          {t('your.balance')}
        </Text>
        <Row alignItems="center">
          <Text
            fontFamily="Mersad_600SemiBold"
            fontSize={24}
            color={COLORS.neutral800}
          >
            {tokenInfo.balance.ether < 1000
              ? NumberUtils.formatNumber(tokenInfo.balance.ether, 2)
              : NumberUtils.abbreviateNumber(tokenInfo.balance.ether)}{' '}
            AMB
          </Text>
          <Spacer horizontal value={scale(8)} />
          <Badge
            icon={
              <Text
                fontFamily="Inter_500Medium"
                fontSize={12}
                color={COLORS.neutral800}
              >
                ${NumberUtils.formatNumber(usdPrice, 2)}
              </Text>
            }
            color={COLORS.gray300}
          />
        </Row>
        {/*<Row>*/}
        {/*  <Text fontFamily="Inter_500Medium" fontSize={14} color={COLORS.neutral800}>*/}
        {/*    %0.00*/}
        {/*  </Text>*/}
        {/*  /!* TODO *!/*/}
        {/*  <Text fontFamily="Inter_500Medium" fontSize={14} color={COLORS.neutral800}>*/}
        {/*    ($10.98)*/}
        {/*  </Text>*/}
        {/*</Row>*/}
      </View>
      <Spacer value={verticalScale(16)} />
      <View style={{ paddingHorizontal: scale(17) }}>
        <Text
          fontFamily="Inter_700Bold"
          fontSize={20}
          color={COLORS.neutral800}
        >
          {t('transactions')}
        </Text>
      </View>
      <View style={{ height: '80%', paddingTop: verticalScale(16) }}>
        <AccountTransactions
          transactions={transactions || tokensAndTransactions?.transactions}
          loading={loading}
        />
      </View>
    </View>
  );
};
