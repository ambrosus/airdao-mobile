import { Spinner, SpinnerProps } from '@components/base';
import React from 'react';
import { View } from 'react-native';

export const CenteredSpinner = (props: SpinnerProps) => {
  return (
    <View style={{ alignSelf: 'center' }}>
      <Spinner {...props} />
    </View>
  );
};
