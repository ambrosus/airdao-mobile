import { TFunction } from 'i18next';
import {
  ProductBridge,
  ProductHarbor,
  ProductKosmos,
  ProductStake,
  ProductSwap
} from '@components/svg/icons/v2';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics';
import { SectionizedProducts } from '../utils';

export const PRODUCTS = (t: TFunction<string>): SectionizedProducts[] => {
  return [
    {
      title: t('products.title.trade'),
      data: [
        // {
        //   id: 5,
        //   uri: 'https://metamask.github.io/test-dapp/',
        //   name: 'Browser',
        //   description: t('products.swap.description'),
        //   icon: (
        //     <SwapAccountActionIcon scale={2} color="rgba(166, 129, 239, 1)" />
        //   ),
        //   background: ['rgba(132, 224, 255, 0.2)', 'rgba(160, 99, 221, 0.2)'],
        //   color: 'rgba(52, 27, 104, 1)',
        //   route: 'BrowserScreen',
        //   isAirDaoApp: 'true',
        //   firebaseEvent: CustomAppEvents.products_swap
        // },
        {
          id: 0,
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
          name: t('account.actions.bridge'),
          description: t('products.bridge.description'),
          icon: <ProductBridge />,
          background: ['rgba(164, 128, 235, 0.2)', 'rgba(210, 95, 95, 0.2)'],
          color: 'rgba(118, 43, 6, 1)',
          route: 'Bridge',
          firebaseEvent: CustomAppEvents.products_bridge
        }
      ]
    },
    {
      title: t('products.title.earn'),
      data: [
        {
          id: 2,
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
          name: 'KOSMOS',
          description: t('products.kosmos.description'),
          icon: <ProductKosmos />,
          background: ['rgba(67, 68, 145, 1)', 'rgba(51, 48, 96, 1)'],
          color: 'rgba(255, 255, 255, 1)',
          route: 'KosmosScreen',
          firebaseEvent: CustomAppEvents.products_kosmos
        },
        {
          id: 4,
          name: 'HARBOR',
          description: t('products.harbor.description'),
          icon: <ProductHarbor />,
          background: ['rgba(255, 201, 62, 1)', 'rgba(224, 131, 0, 1)'],
          color: 'rgba(255, 255, 255, 1)',
          route: 'Harbor',
          firebaseEvent: CustomAppEvents.products_harbor
        }
      ]
    }
  ];
};
