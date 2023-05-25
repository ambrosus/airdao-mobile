import React from 'react';
import { ViewStyle } from 'react-native';
import { BaseButton } from './Button.Base';
import { CircularButtonProps } from './Button.types';

export function CircularButton(props: CircularButtonProps): JSX.Element {
  const {
    style = {},
    children,
    borderRadius = 56,
    testID,
    ...restProps
  } = props;

  const styles: ViewStyle = {
    ...style,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius
  };

  return (
    <BaseButton {...restProps} style={styles} testID={testID}>
      {children}
    </BaseButton>
  );
}
