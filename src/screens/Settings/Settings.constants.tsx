import React from 'react';
import {
  LockIcon,
  NotificationIcon,
  HelpIcon,
  AboutIcon,
  SettingsFilledIcon,
  WalletIcon
} from '@components/svg/icons';
import { SettingsMenuItem } from './Settings.types';
import { COLORS } from '@constants/colors';

export const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  {
    key: 'manageWallets',
    title: 'settings.manage.wallet',
    route: 'ManageWallets',
    icon: <WalletIcon color={COLORS.brand600} />
  },
  {
    key: 'securitySettings',
    title: 'settings.security',
    route: 'SecuritySettings',
    icon: <LockIcon color={COLORS.brand600} />
  },
  {
    key: 'appPreferences',
    title: 'settings.preferences',
    route: 'AppPreferences',
    icon: <SettingsFilledIcon color={COLORS.brand600} />
  },
  {
    key: 'notificationSettings',
    title: 'settings.notifications',
    route: 'NotificationSettings',
    icon: <NotificationIcon color={COLORS.brand600} />
  },
  {
    key: 'helpCenter',
    title: 'settings.help',
    route: 'HelpCenter',
    icon: <HelpIcon scale={1.2} color={COLORS.brand600} />
  },
  {
    key: 'about',
    title: 'settings.about',
    route: 'About',
    icon: <AboutIcon color={COLORS.brand600} />
  }
];
