import React from 'react';
import { ActivityIndicatorProps } from 'react-native';
import LottieView from 'lottie-react-native';
import { moderateScale } from '@utils/scaling';

export function Spinner(
  props: Pick<ActivityIndicatorProps, 'size' | 'color'>
): JSX.Element {
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
