import React from 'react';
import LottieView from 'lottie-react-native';
import { moderateScale } from '@utils/scaling';
import { ViewStyle } from 'react-native';

export interface SpinnerProps {
  containerStyle?: ViewStyle;
  size?: 'large' | 'small';
  customSize?: number;
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const { size = 'small', customSize } = props;

  const _size = customSize || (size === 'small' ? 24 : 48);
  return (
    <LottieView
      autoPlay
      style={{
        width: moderateScale(_size),
        height: moderateScale(_size),
        minHeight: _size,
        minWidth: _size
      }}
      source={require('../../../assets/lottie/spinner.json')}
    />
  );
}
