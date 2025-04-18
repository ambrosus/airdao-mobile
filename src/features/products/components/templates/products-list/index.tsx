import { useCallback, useMemo, useRef } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { COLORS } from '@constants/colors';
import useLocalization from '@contexts/Localizations';
import { useBrowserStore } from '@entities/browser/model';
import { BottomSheetBrowserModal } from '@features/browser/components/templates';
import { PRODUCTS } from '@features/products/entities';
import { Product, SectionizedProducts } from '@features/products/utils';
import { verticalScale } from '@utils';
import { styles } from './styles';
import { ProductListItem } from '../../base';

export const ProductsList = () => {
  const { t } = useTranslation();
  const { browserConfig } = useBrowserStore();
  const { currentLanguage } = useLocalization();

  const disclaimerModalRef = useRef<BottomSheetRef>(null);

  const renderProductItem = useCallback(
    (args: SectionListRenderItemInfo<Product>) => {
      const { item: product } = args;
      return (
        <ProductListItem
          disclaimerModalRef={disclaimerModalRef}
          product={product}
        />
      );
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
      PRODUCTS(t, browserConfig, currentLanguage).map((section) => ({
        ...section,
        data: section.data
      })),
    [browserConfig, currentLanguage, t]
  );

  return (
    <>
      <SectionList<Product, SectionizedProducts>
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        sections={devSupportedProducts}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderProductItem}
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <BottomSheetBrowserModal ref={disclaimerModalRef} />
    </>
  );
};
