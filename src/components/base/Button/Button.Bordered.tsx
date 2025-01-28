import React from 'react';
import { ViewStyle } from 'react-native';
import { COLORS } from '@constants/colors';
import { BaseButton } from './Button.Base';
import { BorderedButtonProps } from './Button.types';

export function BorderedButton(props: BorderedButtonProps): JSX.Element {
  const {
    style = {},
    children,
    borderWidth = 1,
    borderColor = COLORS.black,
    testID,
    ...restProps
  } = props;

  const styles: ViewStyle = {
    ...style,
    borderWidth: borderWidth,
    borderColor: borderColor
  };

  return (
    <BaseButton {...restProps} style={styles} testID={testID}>
      {children}
    </BaseButton>
  );
}
