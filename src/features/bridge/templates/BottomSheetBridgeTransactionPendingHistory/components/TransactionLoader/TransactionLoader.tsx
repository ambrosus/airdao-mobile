import React from 'react';
import { View } from 'react-native';
import { Spinner } from '@components/base';

export const TransactionLoader = () => (
  <View
    style={{
      height: 300,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Spinner size={'large'} />
  </View>
);
