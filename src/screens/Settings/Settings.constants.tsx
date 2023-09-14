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
    key: 'manageWallets',
    title: 'settings.manage.wallet',
    route: 'ManageWallets',
    icon: <WalletTabIcon color={COLORS.blue600} />
  },
  {
    key: 'securitySettings',
    title: 'settings.security',
    route: 'SecuritySettings',
    icon: <LockIcon color={COLORS.blue600} />
  },
  {
    key: 'appPreferences',
    title: 'settings.preferences',
    route: 'AppPreferences',
    icon: <SettingsFilledIcon color={COLORS.blue600} />
  },
  {
    key: 'notificationSettings',
    title: 'settings.notifications',
    route: 'NotificationSettings',
    icon: <NotificationIcon color={COLORS.blue600} />
  },
  {
    key: 'helpCenter',
    title: 'settings.help',
    route: 'HelpCenter',
    icon: <HelpIcon color={COLORS.blue600} />
  },
  {
    key: 'about',
    title: 'settings.about',
    route: 'About',
    icon: <AboutIcon color={COLORS.blue600} />
  }
];
