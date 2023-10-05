import React, { useRef } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import {
  AMBPriceInfo,
  BottomSheetTrade,
  AMBDetailedInfo,
  AMBAbout,
  AMBMarket as AMBMarketsInfo
} from './components';
import { Row, Spacer, Text } from '@components/base';
import { BottomSheetRef, CenteredSpinner, Header } from '@components/composite';
import { LogoGradientCircular, SmallLogoSVG } from '@components/svg/icons';
import { SharePortfolio } from '@components/templates';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks/query';
import { scale, verticalScale } from '@utils/scaling';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const BodyTitle = ({ title }: { title: string }) => (
  <Text fontSize={20} fontFamily="Inter_700Bold" color="#A1A6B2">
    {title}
  </Text>
);

export function AMBMarket(): JSX.Element {
  const { data: ambPrice, loading, error } = useAMBPrice();
  const { t } = useTranslation();
  const marketCap =
    (ambPrice?.circulatingSupply || 0) * (ambPrice?.priceUSD || 0);

  const tradeBottomSheet = useRef<BottomSheetRef>(null);
  const shareBottomSheet = useRef<BottomSheetRef>(null);
  // const onSharePress = () => {
  //   if (!ambPrice) return;
  //   shareBottomSheet.current?.show();
  // };

  const renderErrorView = () => {
    return <Text>{t('could.not.fetch.statistics')}</Text>;
  };

  return (
    <SafeAreaView
      edges={['top']}
      testID="AMBMarket_Screen"
      style={styles.container}
    >
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
                AirDAO (AMB)
              </Text>
            </Row>
          </>
        }
        style={{
          backgroundColor:
            Platform.OS === 'ios' ? COLORS.neutral0 : COLORS.culturedWhite,
          shadowColor: COLORS.culturedWhite
        }}
        // contentRight={
        //   <Button onPress={onSharePress} testID="Share_Button">
        //     <ShareIcon color={COLORS.neutral800} scale={1.5} />
        //     <Spacer horizontal value={scale(20)} />
        //   </Button>
        // }
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {error && renderErrorView()}
        {loading && (
          <View testID="spinner">
            <CenteredSpinner />
          </View>
        )}
        {ambPrice && (
          <>
            <AMBPriceInfo />
            <View
              style={{
                width: '90%',
                height: 1,
                backgroundColor: COLORS.separator,
                alignSelf: 'center'
              }}
            />
            <View style={styles.body}>
              <BodyTitle title={t('about.airdao')} />
              <Spacer value={verticalScale(16)} />
              <AMBAbout />
              <Spacer value={verticalScale(32)} />
              <BodyTitle title={t('stats')} />
              <Spacer value={verticalScale(16)} />
              <AMBDetailedInfo
                maxSupply={NumberUtils.formatNumber(6500000000, 0)}
                totalSupply={NumberUtils.formatNumber(ambPrice.totalSupply, 0)}
                marketCap={'$' + NumberUtils.formatNumber(marketCap, 0)}
                fullyDilutedMarketCap={
                  '$' + NumberUtils.formatNumber(ambPrice.marketCapUSD, 0)
                }
                circulatingSupply={
                  NumberUtils.formatNumber(ambPrice.circulatingSupply, 0) +
                  ' AMB'
                }
                volume24H={
                  '$' + NumberUtils.formatNumber(ambPrice.volumeUSD || 0, 0)
                }
              />
              <Spacer value={verticalScale(8)} />
              <BodyTitle title={t('markets')} />
              <Spacer value={verticalScale(16)} />
              <AMBMarketsInfo />
            </View>
          </>
        )}
      </ScrollView>
      <BottomSheetTrade ref={tradeBottomSheet} />
      <SharePortfolio
        isAMBStatisticsFlow
        ref={shareBottomSheet}
        title={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SmallLogoSVG />
            <Spacer horizontal value={scale(8)} />
            <Text
              fontSize={15}
              color={COLORS.neutral0}
              fontFamily="Inter_600SemiBold"
            >
              AirDAO (AMB)
            </Text>
          </View>
        }
        bottomSheetTitle="Share AMB price"
        balance={NumberUtils.formatNumber(
          ambPrice?.priceUSD ?? 0,
          5
        ).toString()}
        currency={'$'}
        currencyPosition={'left'}
        last24HourChange={ambPrice?.percentChange24H || 0}
        timestamp={ambPrice?.timestamp || new Date()}
      />
    </SafeAreaView>
  );
}
