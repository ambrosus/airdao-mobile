import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Product } from '@features/products/utils';
import { Row, Text } from '@components/base';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const navigation: HomeNavigationProp = useNavigation();

  const onRedirectToProductScreen = useCallback(
    () => navigation.navigate(product.route),
    [product, navigation]
  );

  return (
    <Pressable
      onPress={onRedirectToProductScreen}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <LinearGradient
        style={styles.container}
        colors={product.background}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.25, y: 0 }}
      >
        <Row alignItems="center" justifyContent="space-between">
          <View style={styles.innerContainer}>
            <Text
              fontSize={17}
              fontFamily="Inter_600SemiBold"
              color={product.color}
            >
              {product.name}
            </Text>
            <Text
              fontSize={13}
              fontFamily="Inter_600SemiBold"
              color={product.color}
            >
              {product.description}
            </Text>
          </View>
          {product.icon}
        </Row>
      </LinearGradient>
    </Pressable>
  );
};
