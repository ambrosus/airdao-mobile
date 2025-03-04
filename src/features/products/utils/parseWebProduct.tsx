import { SvgXml } from 'react-native-svg';
import { ProductSwap } from '@components/svg/icons/v2';
import { BrowserItemModel } from '@entities/browser/model';

const DEFAULT_GRADIENT = [
  'rgba(132, 224, 255, 0.2)',
  'rgba(160, 99, 221, 0.2)'
];

const DEFAULT_TEXT_COLOR = 'rgba(52, 27, 104, 1)';

export const parseWebProduct = (
  products: BrowserItemModel[],
  currentLanguage: string
) => {
  return products
    .filter((product) => product.uri && product.name)
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
