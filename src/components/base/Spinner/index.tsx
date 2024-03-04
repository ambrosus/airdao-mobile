import React from 'react';
import LottieView from 'lottie-react-native';
import { moderateScale } from '@utils/scaling';
import { ViewStyle } from 'react-native';

export interface SpinnerProps {
  containerStyle?: ViewStyle;
  size?: 'large' | 'small';
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const { size = 'small' } = props;
  const _size = size === 'small' ? 24 : 48;
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
