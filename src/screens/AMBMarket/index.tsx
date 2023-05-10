import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import {
  BottomSheetRef,
  CircularLogo,
  Header,
  PercentChange,
  PopUpInfo
} from '@components/composite';
import { ShareIcon, TradeIcon } from '@components/svg/icons';
import { BezierChart, SharePortfolio } from '@components/templates';
import { BottomSheetTrade } from './components';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { useAMBPrice } from '@hooks/query';
import { AMBMarketItemsInfo } from './AMBMarket.constants';
import { PopUpPlacement } from '@components/composite/PopUpInfo/PopUpInfo.types';
import { FloatButton } from '@components/base/FloatButton';
import { styles } from './styles';

export function AMBMarket(): JSX.Element {
  const { data, loading, error } = useAMBPrice();
  const marketCap = (data?.circulatingSupply || 0) * (data?.priceUSD || 0);

  const tradeBottomSheet = useRef<BottomSheetRef>(null);
  const shareBottomSheet = useRef<BottomSheetRef>(null);

  const onSharePress = () => {
    if (!data) return;
    shareBottomSheet.current?.show();
  };

  const renderErrorView = () => {
    return <Text>Could not fetch AMB Price</Text>;
  };

  const onTradePress = () => {
    tradeBottomSheet.current?.show();
  };

  return (
    <SafeAreaView testID="ambmarket-screen" style={styles.container}>
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
        {loading && (
          <View testID="spinner">
            <Spinner />
          </View>
        )}
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
                <Button
                  testID="share-button"
                  onPress={onSharePress}
                  style={styles.shareBtn}
                >
                  <ShareIcon color={COLORS.smokyBlack} />
                </Button>
              </Row>
              <Spacer value={verticalScale(12)} />
              <Row alignItems="center">
                <Text fontSize={12} fontWeight="500">
                  {NumberUtils.formatNumber(20000, 0)} AMB
                </Text>
                <Spacer horizontal value={scale(14)} />
                <PercentChange change={data.percentChange24H} />
                <Text fontSize={12} fontWeight="500" color="#323232">
                  24H
                </Text>
              </Row>
            </View>
            <BezierChart
              data={[]}
              axisColor={COLORS.white}
              strokeColor={COLORS.jungleGreen}
              axisLabelColor={COLORS.asphalt}
            />
            <Spacer value={verticalScale(60)} />
            <View style={styles.horizontalPadding}>
              <Row flex={1}>
                <View style={styles.column}>
                  {/* Market Cap */}
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Market Cap{'  '}
                    </Text>
                    <PopUpInfo
                      testID="market-cap-popupinfo"
                      body={AMBMarketItemsInfo.marketCap.body}
                      title={AMBMarketItemsInfo.marketCap.title}
                    />
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(marketCap, 0)}
                  </Text>
                  <Spacer value={verticalScale(6)} />
                  <PercentChange change={data.percentChange24H} />
                  {/* 24 Hour Volume */}
                  <Spacer value={verticalScale(52)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      24hr Volume{'  '}
                    </Text>
                    <PopUpInfo
                      testID="24-hour-volume-popupinfo"
                      placement={PopUpPlacement.BOTTOM}
                      body={AMBMarketItemsInfo.volume24H.body}
                      title={AMBMarketItemsInfo.volume24H.title}
                    />
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
                      Circulating Supply{'  '}
                    </Text>
                    <PopUpInfo
                      testID="circulation-popupinfo"
                      placement={PopUpPlacement.BOTTOM}
                      body={AMBMarketItemsInfo.circulatingSupply.body}
                      title={AMBMarketItemsInfo.circulatingSupply.title}
                    />
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
                      Fully Diluted Market Cap{'  '}
                    </Text>
                    <PopUpInfo
                      testID="diluted-cap-popupinfo"
                      body={AMBMarketItemsInfo.fullyDilutedMarketCap.body}
                      title={AMBMarketItemsInfo.fullyDilutedMarketCap.title}
                    />
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
                  {/* CEX Volume */}
                  <Spacer value={verticalScale(38.49)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      CEX Volume{'  '}
                    </Text>
                    <PopUpInfo
                      testID="cex-volume-popupinfo"
                      placement={PopUpPlacement.BOTTOM}
                      body={AMBMarketItemsInfo.cexVol.body}
                      title={AMBMarketItemsInfo.cexVol.title}
                    />
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    ${NumberUtils.formatNumber(data.volumeUSD, 0)}
                  </Text>

                  {/* DEX Volume */}
                  <Spacer value={verticalScale(12)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      DEX Volume{'  '}
                    </Text>
                    <PopUpInfo
                      testID="dex-volume-popupinfo"
                      placement={PopUpPlacement.BOTTOM}
                      body={AMBMarketItemsInfo.dexVol.body}
                      title={AMBMarketItemsInfo.dexVol.title}
                    />
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">- -</Text>

                  {/* Max Supply */}
                  <Spacer value={verticalScale(31.35)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Max Suppy{'  '}
                    </Text>
                    <PopUpInfo
                      testID="max-supply-popupinfo"
                      body={AMBMarketItemsInfo.maxSupply.body}
                      title={AMBMarketItemsInfo.maxSupply.title}
                    />
                  </Row>
                  <Spacer value={verticalScale(6)} />
                  <Text fontFamily="Mersad_600SemiBold">
                    {NumberUtils.formatNumber(6500000000, 0)}
                  </Text>

                  {/* Total Supply */}
                  <Spacer value={verticalScale(12)} />
                  <Row alignItems="center">
                    <Text fontSize={12} color="#828282">
                      Total Supply{'  '}
                    </Text>
                    <PopUpInfo
                      testID="total-supply-popupinfo"
                      body={AMBMarketItemsInfo.totalSupply.body}
                      title={AMBMarketItemsInfo.totalSupply.title}
                    />
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
        testID="trade-button"
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
