import { Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Image, Platform } from 'react-native';
import { ProductSwap } from '@components/svg/icons/v2';
import { BrowserItemModel } from '@entities/browser/model';
import { Product } from '@features/products/utils/product';

enum Products {
  AstraDEX = 'Astra DEX'
}

const DEFAULT_GRADIENT = [
  'rgba(132, 224, 255, 0.2)',
  'rgba(160, 99, 221, 0.2)'
];

const DEFAULT_TEXT_COLOR = 'rgba(52, 27, 104, 1)';

export const parseWebProduct = (
  products: BrowserItemModel[],
  currentLanguage: string
): Product[] => {
  return products
    .filter((product) => product.uri && product.name)
    .filter((product) => product?.platforms?.includes(Platform.OS))
    .map((product: BrowserItemModel) => {
      const icon = product.icon ? (
        <SvgXml xml={product.icon} width={56} height={56} />
      ) : (
        <ProductSwap />
      );

      return {
        ...product,
        icon,
        name: product.name[currentLanguage],
        route: 'BrowserScreen',
        background: product.background || DEFAULT_GRADIENT,
        color: product.color || DEFAULT_TEXT_COLOR,
        description: product.description[currentLanguage],
        isAirDaoApp: product.isAirDaoApp === 'true' || false,
        // TODO firebaseEVENT
        firebaseEvent: ''
      };
    });
};

export const filterDisplayedProducts = (products: any[]) => {
  const productsToIgnore = Platform.select({
    android: [Products.AstraDEX],
    ios: [],
    default: []
  });

  return products.filter((product) => !productsToIgnore.includes(product.name));
};
