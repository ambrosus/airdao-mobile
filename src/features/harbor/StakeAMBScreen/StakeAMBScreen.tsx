import React from 'react';
import { View } from 'react-native';
import { Header } from '@components/composite';
import { styles } from './StakeAMBScreen.styles';

export const StakeAMBScreen = () => {
  return (
    <View style={styles.main}>
      <Header title="HarborStakeAMB" />
    </View>
  );
};
