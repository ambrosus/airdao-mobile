import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RightArrowIcon } from '@components/svg/icons/RightArrow';
import { COLORS } from '@constants/colors';

export const RightArrowInCircle = ({ scale = 1 }: { scale?: number }) => {
  const size = 40;
  const width = size * scale;
  const height = size * scale;
  const borderRadius = width + height / 2;

  const containerStyle = useMemo(
    () => ({
      ...styles.reorder,
      width,
      height,
      borderRadius
    }),
    [borderRadius, height, width]
  );

  return (
    <View style={containerStyle}>
      <RightArrowIcon color={COLORS.black} scale={scale + 0.4} />
    </View>
  );
};

const styles = StyleSheet.create({
  reorder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    bottom: 3
  }
});
