import { RefObject, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { lowerCase } from 'lodash';
import capitalize from 'lodash/capitalize';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { Product } from '@features/products/utils';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics';
import { hasDigits } from '@utils';
import { styles } from './styles';

interface ProductListItemProps {
  product: Product;
  disclaimerModalRef: RefObject<BottomSheetRef>;
}

export const ProductListItem = ({
  product,
  disclaimerModalRef
}: ProductListItemProps) => {
  const navigation: HomeNavigationProp = useNavigation();
  const { t } = useTranslation();
  const isBrowserProduct = product.route === 'BrowserScreen';

  const toggleBrowser = useCallback(
    (uri: string) => {
      if (!uri) {
        return;
      }
      if (product.isAirDaoApp) {
        navigation.navigate('BrowserScreen', { uri });
      } else {
        disclaimerModalRef?.current?.show({
          title: t('browser.disclaimer.header'),
          subTitle: t('browser.disclaimer.description'),
          buttonsLabels: [t('button.processed')],
          onApprove: () => navigation.navigate('BrowserScreen', { uri })
        });
      }
    },
    [disclaimerModalRef, navigation, product.isAirDaoApp, t]
  );

  const onRedirectToProductScreen = useCallback(() => {
    if (isBrowserProduct) {
      toggleBrowser(product.uri ?? '');
    } else {
      // TODO fix navigation types
      // @ts-ignore
      navigation.navigate(product.route);
    }
    if (product.firebaseEvent) {
      sendFirebaseEvent(product.firebaseEvent);
    }
  }, [
    isBrowserProduct,
    product.firebaseEvent,
    product.uri,
    product.route,
    toggleBrowser,
    navigation
  ]);

  const name = useMemo(() => {
    const _name = hasDigits(product.name)
      ? product.name
      : lowerCase(product.name);
    return capitalize(_name);
  }, [product.name]);

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
              {name}
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
