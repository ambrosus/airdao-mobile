import { useCallback, useMemo } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { PRODUCTS } from '@features/products/entities';
import { Product, SectionizedProducts } from '@features/products/utils';
import { verticalScale } from '@utils';
import { styles } from './styles';
import { ProductListItem } from '../../base';

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

  const devSupportedProducts = useMemo(
    () =>
      PRODUCTS(t).map((section) => ({
        ...section,
        data: section.data.filter(
          (item) => !(!__DEV__ && item.route === 'BrowserScreen')
        )
      })),
    [t]
  );

  return (
    <SectionList<Product, SectionizedProducts>
      bounces={false}
      keyExtractor={(item) => item.id.toString()}
      sections={devSupportedProducts}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderProductItem}
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};
