import React from 'react';
import { View } from 'react-native';
import { Header } from '@components/composite';
import { styles } from './BorrowHarborScreen.styles';

export const BorrowHarborScreen = () => {
  return (
    <View style={styles.main}>
      <Header title="HarborBORROW" />
    </View>
  );
};
