import { useCallback, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { lowerCase } from 'lodash';
import capitalize from 'lodash/capitalize';
import { HomeNavigationProp } from '@appTypes';
import { Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { DisclaimerModal } from '@features/browser/components/templates';
import { Product } from '@features/products/utils';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics';
import { hasDigits } from '@utils';
import { styles } from './styles';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  const navigation: HomeNavigationProp = useNavigation();
  const disclaimerModalRef = useRef<BottomSheetRef>(null);

  const toggleBrowser = useCallback(
    (uri: string) => {
      if (!uri) {
        return;
      }
      if (product.isAirDaoApp) {
        navigation.navigate('BrowserScreen', { uri });
      } else {
        disclaimerModalRef?.current?.show();
      }
    },
    [navigation, product.isAirDaoApp]
  );

  const onRedirectToProductScreen = useCallback(() => {
    if (product.route === 'BrowserScreen') {
      toggleBrowser(product.uri ?? '');
    } else {
      // TODO fix navigation types
      // @ts-ignore
      navigation.navigate(product.route);
    }
    sendFirebaseEvent(product.firebaseEvent);
  }, [
    product.route,
    product.firebaseEvent,
    product.uri,
    toggleBrowser,
    navigation
  ]);

  const onApprove = () => {
    disclaimerModalRef?.current?.dismiss();
    setTimeout(
      () => navigation.navigate('BrowserScreen', { uri: product?.uri ?? '' }),
      200
    );
  };

  const onReject = () => {
    disclaimerModalRef?.current?.dismiss();
  };

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
        <DisclaimerModal
          ref={disclaimerModalRef}
          onApprove={onApprove}
          onReject={onReject}
        />
      </LinearGradient>
    </Pressable>
  );
};
