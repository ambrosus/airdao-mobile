import React from 'react';
import { View } from 'react-native';
import { AnimatedTabs } from '@components/modular';

export const ExactMarketTokenTabs = () => {
  return (
    <AnimatedTabs
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          title: 'Buy bond',
          view: <View style={{ flex: 1, backgroundColor: 'red' }} />
        },
        {
          title: 'Buy bond',
          view: <View style={{ flex: 1, backgroundColor: 'yellow' }} />
        }
      ]}
    />
  );
};
