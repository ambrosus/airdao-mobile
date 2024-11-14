import { View } from 'react-native';
import { Spinner } from '@components/base';
import React from 'react';

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
