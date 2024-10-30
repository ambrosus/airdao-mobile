import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Text } from '@components/base';

export const ProductScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Products</Text>
    </SafeAreaView>
  );
};
