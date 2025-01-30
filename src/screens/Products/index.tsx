import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { ProductsList } from '@features/products/components/templates';
import { styles } from './styles';

export const ProductScreen = () => {
  const { t } = useTranslation();
  const renderLeftHeaderComponent = useMemo(
    () => (
      <Text fontSize={22} fontFamily="Inter_700Bold" color={COLORS.neutral800}>
        {t('products.header')}
      </Text>
    ),
    [t]
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
