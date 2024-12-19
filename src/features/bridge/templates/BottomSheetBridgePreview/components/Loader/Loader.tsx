import React from 'react';
import { View } from 'react-native';
import { Spacer, Spinner } from '@components/base';

export const Loader = () => (
  <View style={{ alignItems: 'center' }}>
    <Spacer value={60} />
    <Spinner size="large" />
    <Spacer value={100} />
  </View>
);
