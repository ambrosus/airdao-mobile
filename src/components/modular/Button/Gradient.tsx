import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { ButtonProps } from '@components/base/Button';
import { cssShadowToNative } from '@utils/css-shadow-to-native';

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
  shadowEnable?: boolean;
  CSSShadowProperty?: string;
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
    onPress,
    CSSShadowProperty = '',
    shadowEnable
  } = props;

  const buttonShadow: StyleProp<ViewStyle> = useMemo(() => {
    if (props.disabled || !shadowEnable) return { shadowOpacity: 0 };

    return cssShadowToNative(CSSShadowProperty);
  }, [CSSShadowProperty, props.disabled, shadowEnable]);

  return (
    <Button
      onPress={onPress}
      style={{ ...styles.container, ...buttonShadow, ...(style as object) }}
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
    alignItems: 'center'
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
