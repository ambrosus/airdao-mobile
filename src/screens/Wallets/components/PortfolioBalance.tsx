import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ChevronRightIcon } from '@components/svg/icons';
import { NumberUtils } from '@utils/number';
import { BezierChart, Point } from '@components/templates';
import { Badge } from '@components/base/Badge';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';

interface PortfolioBalanceProps {
  AMBPrice: number;
  AMBPriceLast24HourChange: number; // TODO there is actually no percent change coming from API
}

export function PortfolioBalance(props: PortfolioBalanceProps): JSX.Element {
  const { AMBPrice, AMBPriceLast24HourChange } = props;
  const navigation = useNavigation<WalletsNavigationProp>();

  const chartData: Point[] = [];

  const navigateToAMBScreen = () => {
    navigation.navigate('AMBMarketScreen');
  };

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
          <Text
            color={COLORS.smokyBlack}
            heading
            fontFamily="Mersad_600SemiBold"
            fontSize={30}
            testID="Portfolio_Balance_Title"
          >
            ${NumberUtils.formatNumber(AMBPrice, 6)}
          </Text>
        </Row>
        <Spacer value={scale(16)} />
        <Button style={styles.badge} onPress={navigateToAMBScreen}>
          <Badge
            icon={
              <Row alignItems="center" style={styles.balanceLast24HourChange}>
                <Text
                  fontFamily="Inter_500Medium"
                  fontSize={16}
                  color={COLORS.jungleGreen}
                >
                  + {NumberUtils.formatNumber(AMBPriceLast24HourChange)}%
                </Text>
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
        <Text>Test EAS Update</Text>
        <BezierChart
          height={verticalScale(200)}
          data={chartData}
          axisLabelColor={COLORS.smokyBlack}
          strokeColor={COLORS.jungleGreen}
          axisColor="transparent"
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
