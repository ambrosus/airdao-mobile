import React from 'react';
import { TFunction } from 'i18next';
import {
  BridgeAccountActionIcon,
  SwapAccountActionIcon
} from '@components/svg/icons/v2/actions';
import { HarborAccountAction } from '@components/svg/icons/v2/harbor';
import { SectionizedProducts } from '../utils';

export const PRODUCTS = (t: TFunction<string>): SectionizedProducts[] => {
  return [
    {
      title: t('products.title.trade'),
      data: [
        {
          id: 0,
          name: t('token.actions.swap'),
          description: t('products.swap.description'),
          icon: (
            <SwapAccountActionIcon scale={2} color="rgba(166, 129, 239, 1)" />
          ),
          background: ['rgba(132, 224, 255, 0.2)', 'rgba(160, 99, 221, 0.2)'],
          color: 'rgba(52, 27, 104, 1)',
          route: 'SwapScreen'
        },
        {
          id: 1,
          name: t('account.actions.bridge'),
          description: t('products.bridge.description'),
          icon: (
            <BridgeAccountActionIcon scale={2} color="rgba(255, 152, 99, 1)" />
          ),
          background: ['rgba(164, 128, 235, 0.2)', 'rgba(210, 95, 95, 0.2)'],
          color: 'rgba(118, 43, 6, 1)',
          route: 'Bridge'
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
          icon: (
            <SwapAccountActionIcon scale={2} color="rgba(255, 255, 255, 1)" />
          ),
          background: ['rgba(53, 104, 221, 1)', 'rgba(33, 65, 140, 1)'],
          color: 'rgba(255, 255, 255, 1)',
          route: 'StakingPools'
        },
        {
          id: 3,
          name: 'KOSMOS',
          description: t('products.kosmos.description'),
          icon: (
            <SwapAccountActionIcon scale={2} color="rgba(255, 255, 255, 1)" />
          ),
          background: ['rgba(67, 68, 145, 1)', 'rgba(51, 48, 96, 1)'],
          color: 'rgba(255, 255, 255, 1)',
          route: 'KosmosScreen'
        },
        {
          id: 4,
          name: 'HARBOR',
          description: t('products.kosmos.description'),
          icon: <HarborAccountAction scale={1} />,
          background: ['rgba(255, 201, 62, 1)', 'rgba(224, 131, 0, 1)'],
          color: 'rgba(255, 255, 255, 1)',
          route: 'Harbor'
        }
      ]
    }
  ];
};
