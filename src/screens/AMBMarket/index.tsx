import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import {
  AMBAbout,
  AMBDetailedInfo,
  AMBMarket as AMBMarketsInfo,
  AMBPriceInfo
} from './components';
import { Row, Spacer, Text } from '@components/base';
import { CenteredSpinner, Header } from '@components/composite';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks/query';
import { scale, verticalScale } from '@utils/scaling';

const BodyTitle = ({ title }: { title: string }) => (
  <Text fontSize={16} fontFamily="Inter_500Medium" color={COLORS.neutral800}>
    {title}
  </Text>
);

export function AMBMarket(): JSX.Element {
  const { data: ambPrice, loading, error } = useAMBPrice();
  const { t } = useTranslation();
  const marketCap =
    (ambPrice?.circulatingSupply || 0) * (ambPrice?.priceUSD || 0);

  const dailyVolume = useMemo(() => {
    if (!ambPrice) return 0;

    const { marketCapUSD, percentChange24H } = ambPrice;
    const marketCapPrevious = marketCapUSD / (1 + percentChange24H / 100);
    const volumeUSD = marketCapUSD - marketCapPrevious;

    return volumeUSD;
  }, [ambPrice]);

  const renderErrorView = () => {
    return (
      <>
        <Spacer value={16} />
        <Text align="center" color={COLORS.error600}>
          {t('amb.market.could.not.fetch')}
        </Text>
      </>
    );
  };

  const renderHeaderTitleComponent = useMemo(
    () => (
      <Row alignItems="center">
        <Spacer horizontal value={scale(4)} />
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={20}
          color={COLORS.neutral800}
        >
          {t('amb.market.header')}
        </Text>
      </Row>
    ),
    [t]
  );

  const detailedInfoProps = useMemo(
    () => ({
      maxSupply: `${NumberUtils.numberToTransformedLocale(6500000000)} AMB`,
      totalSupply: `${NumberUtils.numberToTransformedLocale(6500000000)} AMB`,
      volume24H: `$${NumberUtils.numberToTransformedLocale(dailyVolume)}`,
      marketCap: `$${NumberUtils.numberToTransformedLocale(marketCap)}`,
      circulatingSupply: `${NumberUtils.numberToTransformedLocale(
        ambPrice?.circulatingSupply ?? 0
      )} AMB`
    }),
    [ambPrice?.circulatingSupply, dailyVolume, marketCap]
  );

  return (
    <SafeAreaView
      edges={['top']}
      testID="AMBMarket_Screen"
      style={styles.container}
    >
      <Header
        bottomBorder
        title={renderHeaderTitleComponent}
        style={styles.header}
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
            <AMBPriceInfo header="AirDAO" />
            <View style={styles.body}>
              <BodyTitle title={t('amb.market.stats')} />
              <Spacer value={verticalScale(16)} />
              <AMBDetailedInfo {...detailedInfoProps} />
              <Spacer value={verticalScale(8)} />
              <BodyTitle title={t('settings.about')} />
              <Spacer value={verticalScale(8)} />
              <AMBAbout />
              <Spacer value={verticalScale(32)} />
              <BodyTitle title={t('amb.market.markets')} />
              <Spacer value={verticalScale(18)} />
              <AMBMarketsInfo />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
