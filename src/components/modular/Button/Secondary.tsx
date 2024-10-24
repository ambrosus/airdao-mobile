import React from 'react';
import { Button } from '@components/base';
import { ButtonProps } from '@components/base/Button';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const SecondaryButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      // eslint-disable-next-line @typescript-eslint/ban-types
      style={{ ...styles.container, ...(props.style as {}) }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.alphaBlack5,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: 1000
  }
});
