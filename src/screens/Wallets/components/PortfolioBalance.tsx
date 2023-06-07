import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GraphPoint } from 'react-native-graph';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ChevronRightIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { BezierChart } from '@components/templates';
import { Badge } from '@components/base/Badge';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';
import { useNavigation } from '@react-navigation/native';
import { CMCInterval, WalletsNavigationProp } from '@appTypes';
import { PercentChange } from '@components/composite';
import { useAMBPriceHistorical } from '@hooks';
import { generateRandomGraphData } from '@components/templates/BezierChart/data';

interface PortfolioBalanceProps {
  AMBPrice: number;
  AMBPriceLast24HourChange: number; // TODO there is actually no percent change coming from API
}

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const { AMBPrice, AMBPriceLast24HourChange } = props;
  const navigation = useNavigation<WalletsNavigationProp>();
  const { data: historicalAMBPrice } = useAMBPriceHistorical('30d');
  const [ambPriceDisplay, setAmbPriceDisplay] = useState(
    Number.isNaN(AMBPrice) ? 0 : AMBPrice
  );

  const [selectedInterval, setSelectedInverval] = useState<CMCInterval>('1h');

  useEffect(() => {
    setAmbPriceDisplay(Number.isNaN(AMBPrice) ? 0 : AMBPrice);
  }, [AMBPrice]);

  // const chartData: GraphPoint[] = historicalAMBPrice.map((token, idx) => ({
  //   date: new Date(token.timestamp.getTime() + idx),
  //   value: token.priceUSD
  // }));

  const chartData: GraphPoint[] = useMemo(
    () => generateRandomGraphData(selectedInterval == '1h' ? 50 : 50),
    [selectedInterval]
  );

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

  console.log(chartData[49]);

  return (
    <View style={styles.container} testID="portfolio-balance">
      <View style={styles.content}>
        <Spacer value={scale(38)} />
        <Row alignItems="center" justifyContent="center">
          <AirDAOLogo />
          <Spacer horizontal value={scale(10)} />
          <Text
            align="center"
            fontFamily="Inter_600SemiBold"
            fontSize={15}
            color={COLORS.smokyBlack}
          >
            AirDAO (AMB)
          </Text>
        </Row>
        <Row style={styles.balance}>
          {/* <Animated.Text>{ambPrice.current}</Animated.Text> */}
          <Text
            color={COLORS.smokyBlack}
            heading
            fontFamily="Mersad_600SemiBold"
            fontSize={30}
            testID="Portfolio_Balance_Title"
          >
            ${NumberUtils.formatNumber(ambPriceDisplay, 6)}
          </Text>
        </Row>
        <Spacer value={scale(16)} />
        <Button style={styles.badge} onPress={navigateToAMBScreen}>
          <Badge
            icon={
              <Row alignItems="center" style={styles.balanceLast24HourChange}>
                <PercentChange
                  change={AMBPriceLast24HourChange}
                  fontSize={16}
                  fontWeight="500"
                />
                <Spacer horizontal value={scale(4)} />
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={14}
                  color={COLORS.smokyBlack}
                >
                  (24hr)
                </Text>
                <Spacer horizontal value={scale(4)} />
                <ChevronRightIcon color={COLORS.smokyBlack} />
              </Row>
            }
          />
        </Button>
        <BezierChart
          key={selectedInterval}
          intervals={['1H', '1D', '1W', '1M']}
          height={verticalScale(200)}
          data={chartData}
          axisLabelColor={COLORS.smokyBlack}
          strokeColor={COLORS.chartGreen}
          axisColor="transparent"
          // onPointSelected={(point) => setAmbPriceDisplay(point.value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.5,
    backgroundColor: '#f3f5f7'
  },
  content: {
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center'
  },
  badge: {
    width: '40%',
    alignSelf: 'center'
  },
  balance: {
    marginTop: verticalScale(17),
    alignSelf: 'center'
  },
  balanceAction: {
    backgroundColor: '#FFFFFF1A',
    width: scale(24),
    height: scale(24),
    marginLeft: scale(14)
  },
  balanceLast24HourChange: {
    marginHorizontal: scale(13)
  }
});
