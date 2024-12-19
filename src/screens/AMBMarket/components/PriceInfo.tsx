import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AMBPriceHistory } from '@components/templates';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils';
import { LogoGradientCircular } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';

interface AMBPriceInfoProps {
  header?: string;
}

export function AMBPriceInfo({ header }: AMBPriceInfoProps): JSX.Element {
  return (
    <View style={styles.container}>
      {!!header && (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <LogoGradientCircular />
          <Spacer horizontal value={5} />
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={15}
            color={COLORS.neutral800}
          >
            {header}
          </Text>
        </View>
      )}
      <AMBPriceHistory badgeType="view" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(29),
    alignItems: 'center'
  }
});
