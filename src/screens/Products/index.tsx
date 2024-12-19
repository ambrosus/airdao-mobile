import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { ProductsList } from '@features/products/components/templates';
import { styles } from './styles';

export const ProductScreen = () => {
  const renderLeftHeaderComponent = useMemo(
    () => (
      <Text fontSize={22} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        Products
      </Text>
    ),
    []
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        bottomBorder
        backIconVisible={false}
        contentLeft={renderLeftHeaderComponent}
      />
      <ProductsList />
    </SafeAreaView>
  );
};
