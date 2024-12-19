import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { lowerCase } from 'lodash';
import capitalize from 'lodash/capitalize';
import { HomeNavigationProp } from '@appTypes';
import { Row, Text } from '@components/base';
import { Product } from '@features/products/utils';
import { styles } from './styles';

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
              {capitalize(lowerCase(product.name))}
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
