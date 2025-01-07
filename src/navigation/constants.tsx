import React from 'react';
import {
  ProductsActiveIcon,
  ProductsInactiveIcon,
  SettingsActiveIcon,
  SettingsInactiveIcon,
  WalletsActiveIcon,
  WalletsInactiveIcon
} from '@components/svg/icons/v2/bottom-tabs-navigation';
import { COLORS } from '@constants/colors';

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
