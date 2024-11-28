import {
  ProductsActiveIcon,
  ProductsInactiveIcon,
  SettingsActiveIcon,
  SettingsInactiveIcon,
  WalletsActiveIcon,
  WalletsInactiveIcon
} from '@components/svg/icons/v2/bottom-tabs-navigation';
import { COLORS } from '@constants/colors';
import React from 'react';
import {
  BorrowIcon,
  StakeAMBIcon,
  StakeHBRIcon
} from '@components/svg/icons/v2/harbor-bottom-tabs';

export const MAIN_TABS = {
  Wallets: {
    inactiveIcon: <WalletsInactiveIcon color={COLORS.neutral200} />,
    activeIcon: <WalletsActiveIcon color={COLORS.brand600} />
  },
  Products: {
    inactiveIcon: <ProductsInactiveIcon color={COLORS.neutral800} />,
    activeIcon: <ProductsActiveIcon color={COLORS.brand600} />
  },
  Settings: {
    inactiveIcon: <SettingsInactiveIcon color={COLORS.neutral200} />,
    activeIcon: <SettingsActiveIcon color={COLORS.brand600} />
  }
};

export const HARBOR_TABS = {
  StakeAMB: {
    inactiveIcon: <StakeAMBIcon color={COLORS.neutral200} />,
    activeIcon: <StakeAMBIcon color={COLORS.brand600} />
  },
  StakeHBR: {
    inactiveIcon: <StakeHBRIcon color={COLORS.neutral200} />,
    activeIcon: <StakeHBRIcon color={COLORS.brand600} />
  },
  BorrowHarbor: {
    inactiveIcon: <BorrowIcon color={COLORS.neutral200} />,
    activeIcon: <BorrowIcon color={COLORS.brand600} />
  }
};
