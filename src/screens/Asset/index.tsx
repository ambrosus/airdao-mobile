import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeParamsList, WalletsNavigationProp } from '@appTypes';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { StatisticsLogo } from '@components/svg/icons/Statistics';
import { View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { useExplorerInfo, useTransactionsOfAccount, useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { WalletTransactions } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions';
import { LogoGradientCircular } from '@components/svg/icons';
import { useTranslation } from 'react-i18next';

export const AssetScreen = () => {
  const {
    params: { account }
  } = useRoute<RouteProp<HomeParamsList, 'AssetScreen'>>();
  const navigation = useNavigation<WalletsNavigationProp>();
  const usdPrice = useUSDPrice(account.ambBalance || 0);
  const { t } = useTranslation();
  const { data: infoData } = useExplorerInfo();

  const initialMount = useRef(true);
  const TRANSACTION_LIMIT = 20;
  const { data: transactions, loading: transactionsLoading } =
    useTransactionsOfAccount(
      account.address,
      1,
      TRANSACTION_LIMIT,
      '',
      !initialMount.current
    );
  initialMount.current = false;

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  return (
    <SafeAreaView>
      <Header
        title={
          <>
            <Row alignItems="center">
              <LogoGradientCircular />
              <Spacer horizontal value={scale(4)} />
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.nero}
              >
                AirDAO (AMB)
              </Text>
            </Row>
          </>
        }
        contentRight={
          <>
            <Button onPress={navigateToAMBScreen}>
              <StatisticsLogo />
            </Button>
          </>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={verticalScale(16)} />
      <View style={{ alignItems: 'center' }}>
        <Text fontFamily="Inter_600SemiBold" fontSize={16} color="#A1A6B2">
          {t('your.balance')}
        </Text>
        <Row alignItems="center">
          <Text fontFamily="Mersad_600SemiBold" fontSize={24} color="#191919">
            {account.ambBalance} AMB
          </Text>
          <Spacer horizontal value={scale(8)} />
          <Badge
            icon={
              <Text
                fontFamily="Inter_500Medium"
                fontSize={12}
                color={COLORS.nero}
              >
                ${NumberUtils.formatNumber(usdPrice, 2)}
              </Text>
            }
            color={COLORS.gray300}
          />
        </Row>
        <Row>
          <Text fontFamily="Inter_500Medium" fontSize={14} color={COLORS.nero}>
            {NumberUtils.formatNumber(
              account.calculatePercentHoldings(infoData?.totalSupply || 1),
              2
            )}
            %
          </Text>
          {/* TODO */}
          <Text fontFamily="Inter_500Medium" fontSize={14} color={COLORS.nero}>
            ($10.98)
          </Text>
        </Row>
      </View>
      <Spacer value={verticalScale(16)} />
      <Text align="center">Buttons</Text>
      <Spacer value={verticalScale(16)} />
      <View style={{ paddingHorizontal: scale(17) }}>
        <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
          {t('transactions')}
        </Text>
      </View>
      <WalletTransactions
        transactions={transactions}
        loading={transactionsLoading}
      />
    </SafeAreaView>
  );
};
