import { TFunction } from 'i18next';
import {
  ProductBridge,
  ProductHarbor,
  ProductKosmos,
  ProductStake,
  ProductSwap
} from '@components/svg/icons/v2';
import { BrowserConfig } from '@entities/browser/model';
import {
  parseWebProduct,
  Product,
  PRODUCT_SEQUENCE,
  ProductSections,
  ProductSequence,
  SectionizedProducts
} from '@features/products/utils';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics';
import { isIos } from '@utils';

export const PRODUCTS = (
  t: TFunction<string>,
  browserConfig: BrowserConfig,
  currentLanguage: string
): SectionizedProducts[] => {
  const mobileProductActions = [
    {
      id: 0,
      section: ProductSections.Trade,
      name: t('token.actions.swap'),
      description: t('products.swap.description'),
      icon: <ProductSwap />,
      background: ['rgba(132, 224, 255, 0.2)', 'rgba(160, 99, 221, 0.2)'],
      color: 'rgba(52, 27, 104, 1)',
      route: 'SwapScreen',
      firebaseEvent: CustomAppEvents.products_swap
    },
    {
      id: 1,
      section: ProductSections.Trade,
      name: t('account.actions.bridge'),
      description: t('products.bridge.description'),
      icon: <ProductBridge />,
      background: ['rgba(164, 128, 235, 0.2)', 'rgba(210, 95, 95, 0.2)'],
      color: 'rgba(118, 43, 6, 1)',
      route: 'Bridge',
      firebaseEvent: CustomAppEvents.products_bridge
    },
    {
      id: 2,
      section: ProductSections.Earn,
      name: t('account.actions.stake'),
      description: t('products.stake.description'),
      icon: <ProductStake />,
      background: ['rgba(53, 104, 221, 1)', 'rgba(33, 65, 140, 1)'],
      color: 'rgba(255, 255, 255, 1)',
      route: 'StakingPools',
      firebaseEvent: CustomAppEvents.products_stake
    },
    {
      id: 3,
      section: ProductSections.Earn,
      name: 'Kosmos',
      description: t('products.kosmos.description'),
      icon: <ProductKosmos />,
      background: ['rgba(67, 68, 145, 1)', 'rgba(51, 48, 96, 1)'],
      color: 'rgba(255, 255, 255, 1)',
      route: 'KosmosScreen',
      firebaseEvent: CustomAppEvents.products_kosmos
    },
    {
      id: 4,
      name: 'Harbor',
      section: ProductSections.Earn,
      description: t('products.harbor.description'),
      icon: <ProductHarbor />,
      background: ['rgba(255, 201, 62, 1)', 'rgba(224, 131, 0, 1)'],
      color: 'rgba(255, 255, 255, 1)',
      route: 'Harbor',
      firebaseEvent: CustomAppEvents.products_harbor
    }
  ];

  const allProducts = [
    ...mobileProductActions.filter((item) =>
      isIos ? item.id !== ProductSequence.Swap : true
    ),
    ...(parseWebProduct(browserConfig.products, currentLanguage) as Product[])
  ].sort(
    (a, b) => PRODUCT_SEQUENCE.indexOf(a.id) - PRODUCT_SEQUENCE.indexOf(b.id)
  );

  const filterProduct = (section: ProductSections): Product[] => {
    // @ts-ignore
    return allProducts.filter((item) => item.section === section);
  };

  const products = [
    {
      title: t('products.title.trade'),
      data: filterProduct(ProductSections.Trade)
    },
    {
      title: t('products.title.earn'),
      data: filterProduct(ProductSections.Earn)
    },
    {
      title: t('products.title.web'),
      data: filterProduct(ProductSections.Web)
    }
  ];

  return products.filter((item) => item.data.length);
};
