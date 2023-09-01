import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AMBPriceHistory } from '@components/templates';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils/scaling';

export function AMBPriceInfo(): JSX.Element {
  return (
    <View style={styles.container}>
      <AMBPriceHistory badgeType="view" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(29),
    alignItems: 'center'
  }
});
