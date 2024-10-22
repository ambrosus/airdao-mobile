import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { shadow } from '@constants/shadow';
import { ButtonProps } from '@components/base/Button';

export interface GradientButtonProps extends React.PropsWithChildren {
  onPress: () => void;
  colors?: string[];
  locations?: number[];
  start?: {
    x: number;
    y: number;
  };
  end?: {
    x: number;
    y: number;
  };
  testID?: string;
  style?: ButtonProps['style'];
  disabled?: boolean;
}

export const GradientButton = (props: GradientButtonProps) => {
  const {
    colors = [],
    locations,
    start,
    end,
    children,
    style = {},
    testID,
    disabled,
    onPress
  } = props;
  return (
    <Button
      onPress={onPress}
      // eslint-disable-next-line @typescript-eslint/ban-types
      style={{ ...styles.container, ...(style as {}) }}
      testID={testID}
      disabled={disabled}
    >
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={start}
        end={end}
        locations={locations}
      >
        {children}
      </LinearGradient>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    ...shadow
  },
  gradient: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(24)
  }
});
