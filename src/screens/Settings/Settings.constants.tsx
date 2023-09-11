import React from 'react';
import {
  LockIcon,
  NotificationIcon,
  HelpIcon,
  AboutIcon,
  SettingsFilledIcon
} from '@components/svg/icons';
import { SettingsMenuItem } from './Settings.types';
import { WalletTabIcon } from '@components/svg/BottomTabIcons';
import { COLORS } from '@constants/colors';

export const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  {
    title: 'settings.manage.wallet',
    route: 'ManageWallet',
    icon: <WalletTabIcon color={COLORS.blue600} />
  },
  {
    title: 'settings.security',
    route: 'SecuritySettings',
    icon: <LockIcon color={COLORS.blue600} />
  },
  {
    title: 'settings.preferences',
    route: 'AppPreferences',
    icon: <SettingsFilledIcon color={COLORS.blue600} />
  },
  {
    title: 'settings.notifications',
    route: 'NotificationSettings',
    icon: <NotificationIcon color={COLORS.blue600} />
  },
  {
    title: 'settings.help',
    route: 'HelpCenter',
    icon: <HelpIcon color={COLORS.blue600} />
  },
  {
    title: 'settings.about',
    route: 'About',
    icon: <AboutIcon color={COLORS.blue600} />
  }
];
