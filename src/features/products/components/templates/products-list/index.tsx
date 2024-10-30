import React, { useCallback } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo
} from 'react-native';
import { styles } from './styles';
import { Product, SectionizedProducts } from '@features/products/utils';
import { PRODUCTS } from '@features/products/entities';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { ProductListItem } from '../../base';
import { verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';

export const ProductsList = () => {
  const { t } = useTranslation();
  const renderProductItem = useCallback(
    (args: SectionListRenderItemInfo<Product>) => {
      const { item: product } = args;
      return <ProductListItem product={product} />;
    },
    []
  );

  const renderSectionHeader = useCallback(
    (info: { section: SectionListData<Product, SectionizedProducts> }) => {
      return (
        <Text
          fontSize={14}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral500}
          style={{
            paddingTop: verticalScale(info.section.title === 'Earn' ? 24 : 0)
          }}
        >
          {info.section.title}
        </Text>
      );
    },
    []
  );

  return (
    <SectionList<Product, SectionizedProducts>
      bounces={false}
      keyExtractor={(item) => item.id.toString()}
      sections={PRODUCTS(t)}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderProductItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};
