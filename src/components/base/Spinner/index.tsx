import { COLORS } from '@constants/colors';
import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

export function Spinner(
  props: Pick<ActivityIndicatorProps, 'size'>
): JSX.Element {
  return <ActivityIndicator size={props.size || 'small'} color={COLORS.grey} />;
}
