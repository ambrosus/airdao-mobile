import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { LogoGradient } from '@components/svg/icons';
import { BezierChart } from '@components/templates';
import { COLORS } from '@constants/colors';
import { NumberUtils } from '@utils/number';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

interface AMBPriceInfoProps {
  priceUSD: number;
}

export function AMBPriceInfo(props: AMBPriceInfoProps): JSX.Element {
  const { priceUSD } = props;
  return (
    <View style={styles.container}>
      <Row alignItems="center">
        <LogoGradient />
        <Spacer value={scale(8)} horizontal />
        <Text
          fontSize={15}
          fontFamily="Inter_600SemiBold"
          fontWeight="600"
          color={COLORS.smokyBlack}
        >
          {'AirDAO (AMB)'}
        </Text>
      </Row>
      <Spacer value={verticalScale(12)} />
      <Text
        fontSize={30}
        fontWeight="600"
        fontFamily="Mersad_600SemiBold"
        color={COLORS.jetBlack}
      >
        ${NumberUtils.formatNumber(priceUSD, 6)}
      </Text>
      <BezierChart
        data={[]}
        axisColor={COLORS.white}
        strokeColor={COLORS.jungleGreen}
        axisLabelColor={COLORS.asphalt}
        height={verticalScale(162)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(24),
    paddingTop: verticalScale(36),
    alignItems: 'center'
  }
});
