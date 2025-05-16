import { Alert, Platform } from 'react-native';
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

// Compare semantic versions (x.y.z format)
const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
};

const APP_VERSION = Application?.nativeApplicationVersion ?? '0.0.0';
const MIN_AMBRODEO_VERSION = '1.5.0';

export const parseWebProduct = (
  products: BrowserItemModel[],
  currentLanguage: string
): Product[] => {
  Alert.alert(`1->${Application?.nativeApplicationVersion}`);
  Alert.alert(`2->${compareVersions(APP_VERSION, MIN_AMBRODEO_VERSION) >= 0}`);
  Alert.alert(`3->${APP_VERSION}, ${MIN_AMBRODEO_VERSION}`);

  return products
    .filter((product) => product.uri && product.name)
    .filter((product) => product?.platforms?.includes(Platform.OS))
    .filter((product) => {
      if (product?.uid === 'amb_rodeo') {
        return compareVersions(APP_VERSION, MIN_AMBRODEO_VERSION) >= 0;
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
