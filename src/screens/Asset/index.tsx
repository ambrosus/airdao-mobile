import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Button, Row, Spacer, Text } from '@components/base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeParamsList, WalletsNavigationProp } from '@appTypes';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { StatisticsLogo } from '@components/svg/icons/Statistics';
import { View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { WalletTransactions } from '@components/templates/WalletTransactionsAndAssets/WalletTransactions';
import { LogoGradientCircular } from '@components/svg/icons';
import { useTranslation } from 'react-i18next';
import { API } from '@api/api';
import { Transaction } from '@models';
import { useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';

export const AssetScreen = () => {
  const {
    params: { tokenInfo }
  } = useRoute<RouteProp<HomeParamsList, 'AssetScreen'>>();
  const navigation = useNavigation<WalletsNavigationProp>();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const usdPrice = useUSDPrice(tokenInfo.balance.ether || 0);

  const fetchTransactions = async () => {
    try {
      const response = await API.explorerService.getTokenTransactionsV2(
        '0x4fB246FAf8FAc198f8e5B524E74ABC6755956696',
        tokenInfo.address
      );
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
                color={COLORS.nero}
              >
                {tokenInfo.name}
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
            %0.00
          </Text>
          {/* TODO */}
          <Text fontFamily="Inter_500Medium" fontSize={14} color={COLORS.nero}>
            ($10.98)
          </Text>
        </Row>
      </View>
      <Spacer value={verticalScale(16)} />
      <View style={{ paddingHorizontal: scale(17) }}>
        <Text fontFamily="Inter_700Bold" fontSize={20} color={COLORS.nero}>
          {t('transactions')}
        </Text>
      </View>
      <WalletTransactions transactions={transactions} />
    </View>
  );
};
