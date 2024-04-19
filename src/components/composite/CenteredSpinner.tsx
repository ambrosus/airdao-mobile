import { Spinner, SpinnerProps } from '@components/base';
import React from 'react';
import { View } from 'react-native';

export const CenteredSpinner = (props: SpinnerProps) => {
  const containerStyle = props.containerStyle || {};
  return (
    <View style={{ alignSelf: 'center', ...containerStyle }}>
      <Spinner {...props} />
    </View>
  );
};
