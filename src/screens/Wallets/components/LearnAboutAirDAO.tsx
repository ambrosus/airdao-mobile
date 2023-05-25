import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { ChevronRightIcon, LogoSVG } from '@components/svg/icons';

export function LearnAboutAirDAO(): JSX.Element {
  return (
    <Button style={styles.container}>
      <Row justifyContent="space-between" alignItems="center">
        <Row alignItems="center">
          <View style={styles.logo}>
            <LogoSVG color="#51545a" />
          </View>
          <Text fontWeight="600" fontSize={17} color={COLORS.smokyBlack}>
            Learn about AirDAO
          </Text>
        </Row>
        <ChevronRightIcon color={COLORS.smokyBlack} />
      </Row>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6e6e6',
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(15),
    ...shadow,
    borderRadius: scale(16),
    borderColor: '#F2F2F2'
  },
  logo: {
    padding: moderateScale(7),
    marginRight: scale(11),
    borderRadius: 36
  }
});
