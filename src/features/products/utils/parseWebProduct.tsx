import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { SvgXml } from 'react-native-svg';
import { ProductSwap } from '@components/svg/icons/v2';
import { BrowserItemModel } from '@entities/browser/model';
import { Product } from '@features/products/utils/product';

const DEFAULT_GRADIENT = [
  'rgba(132, 224, 255, 0.2)',
  'rgba(160, 99, 221, 0.2)'
];

const DEFAULT_TEXT_COLOR = 'rgba(52, 27, 104, 1)';

const APP_VERSION = +(Application?.nativeApplicationVersion ?? 0);
const MIN_AMBRODEO_VERSION = 1.5;

export const parseWebProduct = (
  products: BrowserItemModel[],
  currentLanguage: string
): Product[] => {
  return products
    .filter((product) => product.uri && product.name)
    .filter((product) => product?.platforms?.includes(Platform.OS))
    .filter((product) => {
      if (product?.uid === 'amb_rodeo') {
        return APP_VERSION >= MIN_AMBRODEO_VERSION;
      }
      return true;
    })
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
