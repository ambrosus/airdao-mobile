import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AMBPriceInfo,
  BottomSheetTrade,
  AMBDetailedInfo,
  AMBAbout,
  AMBMarket as AMBMarketsInfo
} from './components';
import { Button, Separator, Spacer, Spinner, Text } from '@components/base';
import { BottomSheetRef, Header } from '@components/composite';
import { ShareIcon } from '@components/svg/icons';
import { SharePortfolio } from '@components/templates';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks/query';
import { verticalScale } from '@utils/scaling';
import { styles } from './styles';

const BodyTitle = ({ title }: { title: string }) => (
  <Text fontSize={20} fontFamily="Inter_700Bold" color={COLORS.jetBlack}>
    {title}
  </Text>
);

export function AMBMarket(): JSX.Element {
  const { data: ambPrice, loading, error } = useAMBPrice();
  const marketCap =
    (ambPrice?.circulatingSupply || 0) * (ambPrice?.priceUSD || 0);

  const tradeBottomSheet = useRef<BottomSheetRef>(null);
  const shareBottomSheet = useRef<BottomSheetRef>(null);
  const onSharePress = () => {
    if (!ambPrice) return;
    shareBottomSheet.current?.show();
  };

  const renderErrorView = () => {
    return <Text>Could not fetch AMB Price</Text>;
  };

  return (
    <SafeAreaView testID="ambmarket-screen" style={styles.container}>
      <Header
        title="Statistics"
        style={{
          backgroundColor: COLORS.culturedWhite,
          shadowColor: COLORS.culturedWhite
        }}
        contentRight={
          <Button onPress={onSharePress}>
            <ShareIcon color={COLORS.jetBlack} scale={1.4} />
          </Button>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {error && renderErrorView()}
        {loading && (
          <View testID="spinner">
            <Spinner />
          </View>
        )}
        {ambPrice && (
          <>
            <AMBPriceInfo priceUSD={ambPrice.priceUSD} />
            <View style={styles.body}>
              <BodyTitle title="Info" />
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
              <Separator />
              <Spacer value={verticalScale(24)} />
              <BodyTitle title="About" />
              <Spacer value={verticalScale(16)} />
              <AMBAbout />
              <Spacer value={verticalScale(24)} />
              <Separator />
              <Spacer value={verticalScale(24)} />
              <BodyTitle title="Market" />
              <Spacer value={verticalScale(16)} />
              <AMBMarketsInfo />
            </View>
          </>
        )}
      </ScrollView>
      <BottomSheetTrade ref={tradeBottomSheet} />
      <SharePortfolio
        ref={shareBottomSheet}
        title="AMB Price"
        bottomSheetTitle="Share AMB Price"
        balance={(ambPrice?.priceUSD || 0).toString()}
        currency={'$'}
        currencyPosition={'left'}
        last24HourChange={ambPrice?.percentChange24H || 0}
        timestamp={ambPrice?.timestamp || new Date()}
      />
    </SafeAreaView>
  );
}
