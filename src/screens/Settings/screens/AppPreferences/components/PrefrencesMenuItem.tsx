import React from 'react';
import { AppPreference } from '../AppPrefrences.types';
import { Row, Spacer, Text } from '@components/base';
import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const AppPreferencesMenuItem = (props: AppPreference) => {
  const { title, value } = props;

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.container}
    >
      <Text
        fontSize={16}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral900}
      >
        {title}
      </Text>
      <Row alignItems="center">
        <Text
          fontSize={14}
          fontFamily="Inter_600SemiBold"
          color={COLORS.brand600}
        >
          {value}
        </Text>
        <Spacer value={scale(8)} horizontal />
      </Row>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: moderateScale(16)
  }
});
