import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import {
  BottomSheetRef,
  CircularLogo,
  Header,
  PercentChange
} from '@components/composite';
import { ShareIcon, TradeIcon } from '@components/svg/icons';
import { BezierChart, SharePortfolio } from '@components/templates';
import { FloatButton } from '@components/FloatButton';
import { BottomSheetTrade } from './components';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks/query';
import { styles } from './styles';

export function AMBMarket(): JSX.Element {
  const { data, loading, error } = useAMBPrice();

  const tradeBottomSheet = useRef<BottomSheetRef>(null);
  const shareBottomSheet = useRef<BottomSheetRef>(null);

  const onSharePress = () => {
    // TODO
    if (!data) return;
    shareBottomSheet.current?.show();
  };

  const renderErrorView = () => {
    return <Text>Could not fetch AMB Price</Text>;
  };

  const onTradePress = () => {
    // TODO
    tradeBottomSheet.current?.show();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="AMB Market"
        titlePosition="left"
        style={{ backgroundColor: COLORS.white }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {error && renderErrorView()}
        {loading && <Spinner />}
        {data && (
          <>
            <View style={styles.horizontalPadding}>
              <Row alignItems="center">
                <CircularLogo />
                <Text fontWeight="600" fontSize={15}>
                  Amber {'(AMB)'}
                </Text>
              </Row>
              <Spacer value={verticalScale(12)} />
              <Row alignItems="center">
                <Text fontFamily="Mersad_600SemiBold" fontSize={36}>
                  ${data.priceUSD}
                </Text>
                <Spacer horizontal value={scale(16)} />
                <Button onPress={onSharePress} style={styles.shareBtn}>
                  <ShareIcon color={COLORS.black} />
                </Button>
              </Row>
              <Spacer value={verticalScale(12)} />
              <Row alignItems="center">
                <Text fontSize={12} fontWeight="500">
                  {NumberUtils.formatNumber(20000, 0)} AMB
                </Text>
                <Spacer horizontal value={scale(14)} />
                <PercentChange color="#2F2B43" change={data.percentChange24H} />
                <Text fontSize={12} fontWeight="500" color="#323232">
                  {' '}
                  24H
                </Text>
              </Row>
            </View>
            <BezierChart data={[]} axisColor={COLORS.white} />
            <Spacer value={verticalScale(60)} />
            <View style={styles.horizontalPadding}>
              <Row flex={1}>
                <View style={styles.column}>
                  {/* Market Cap */}
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Market Cap
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    $
                    {NumberUtils.formatNumber(
                      data.circulatingSupply * data.priceUSD,
                      0
                    )}
                  </Text>
                  <Spacer value={verticalScale(6)} />
                  <PercentChange
                    change={data.percentChange24H}
                    color="#2f2b4399"
                  />
                  {/* 24 Hour Volume */}
                  <Spacer value={verticalScale(52)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      24hr Volume
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(data.volumeUSD, 0)}
                  </Text>
                  <Spacer value={verticalScale(6)} />
                  <PercentChange
                    change={data.percentChange24H}
                    color="#2f2b4399"
                  />
                  {/* Circulation */}
                  <Spacer value={verticalScale(57)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Circulating Supply
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(data.circulatingSupply, 0)}
                  </Text>
                  <Spacer value={verticalScale(6)} />
                  <PercentChange
                    change={data.percentChange24H}
                    color="#2f2b4399"
                  />
                </View>
                <View style={styles.column}>
                  {/* Diluted Cap */}
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Fully Diluted Market Cap
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(data.marketCapUSD, 0)}
                  </Text>
                  <Spacer value={verticalScale(6)} />
                  <PercentChange
                    change={data.percentChange24H}
                    color="#2f2b4399"
                  />
                  {/* CEX Volumne */}
                  <Spacer value={verticalScale(38.49)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      CEX Volume
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(data.volumeUSD, 0)}
                  </Text>

                  {/* DEX Volumne */}
                  <Spacer value={verticalScale(12)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      DEX Volume
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">- -</Text>

                  {/* Max Suppy */}
                  <Spacer value={verticalScale(31.35)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Max Suppy
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    {NumberUtils.formatNumber(6500000000, 0)}
                  </Text>

                  {/* Total Suppy */}
                  <Spacer value={verticalScale(12)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Total Suppy
                    </Text>
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    {NumberUtils.formatNumber(data.totalSupply, 0)}
                  </Text>
                </View>
              </Row>
            </View>
          </>
        )}
      </ScrollView>
      <FloatButton
        title="Trade AMB"
        icon={<TradeIcon />}
        onPress={onTradePress}
      />
      <BottomSheetTrade ref={tradeBottomSheet} />
      <SharePortfolio
        ref={shareBottomSheet}
        title="AMB Price"
        bottomSheetTitle="Share AMB Price"
        balance={(data?.priceUSD || 0).toString()}
        currency={'$'}
        currencyPosition={'left'}
        last24HourChange={data?.percentChange24H || 0}
        timestamp={data?.timestamp || new Date()}
      />
    </SafeAreaView>
  );
}
