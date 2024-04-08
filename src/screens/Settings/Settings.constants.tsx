import React from 'react';
import {
  AboutIcon,
  LockIcon,
  NotificationIcon,
  SettingsFilledIcon,
  TelegramSettingsIcon,
  WalletIcon
} from '@components/svg/icons';
import { SettingsMenuItem } from './Settings.types';
import { COLORS } from '@constants/colors';
import XTwitterIcon from '@components/svg/icons/XTwitterIcon';
import MediumIcon from '@components/svg/icons/MediumIcon';

const walletGroup: SettingsMenuItem[] = [
  {
    key: 'manageWallets',
    title: 'settings.manage.wallet',
    route: 'ManageWallets',
    icon: <WalletIcon color={COLORS.neutral400} />
  }
];
const appSettingsGroup: SettingsMenuItem[] = [
  {
    key: 'securitySettings',
    title: 'settings.security',
    route: 'SecuritySettings',
    icon: <LockIcon color={COLORS.neutral400} />
  },
  {
    key: 'appPreferences',
    title: 'settings.preferences',
    route: 'AppPreferences',
    icon: <SettingsFilledIcon color={COLORS.neutral400} />
  },
  {
    key: 'notificationSettings',
    title: 'settings.notifications',
    route: 'NotificationSettings',
    icon: <NotificationIcon color={COLORS.neutral400} />
  }
];

const helpGroup: SettingsMenuItem[] = [
  {
    key: 'about',
    title: 'settings.about',
    route: 'About',
    icon: <AboutIcon color={COLORS.neutral400} />
  }
  // TODO temporarily hide help centre section
  // {
  //   key: 'helpCenter',
  //   title: 'settings.help',
  //   route: 'HelpCenter',
  //   icon: <HelpIcon color={COLORS.neutral400} />
  // }
];

const socialGroup: SettingsMenuItem[] = [
  {
    key: 'xTwitter',
    title: 'settings.twitter',
    route: 'Twitter',
    icon: <XTwitterIcon color={COLORS.neutral400} />
  },
  {
    key: 'telegram',
    title: 'settings.telegram',
    route: 'telegram',
    icon: <TelegramSettingsIcon color={COLORS.neutral400} />
  },
  {
    key: 'medium',
    title: 'settings.medium',
    route: 'Medium',
    icon: <MediumIcon color={COLORS.neutral400} />
  }
];

export const SETTINGS_MENU_ITEMS: SettingsMenuItem[][] = [
  walletGroup,
  appSettingsGroup,
  helpGroup,
  socialGroup
];
