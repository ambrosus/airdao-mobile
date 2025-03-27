import {
  MediumIcon,
  XTwitterIcon,
  TelegramSettingsIcon
} from '@components/svg/icons';
import {
  AboutIcon,
  CompassIcon,
  GlobalFill,
  NotificationIcon,
  Preferences,
  SecurityIcon,
  WalletIcon,
  WatchListIcon
} from '@components/svg/icons/v2/settings';
import { COLORS } from '@constants/colors';
import { SettingsMenuItem } from '@screens/Settings/Settings.types';

export const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
  {
    key: 'manageWallets',
    title: 'settings.manage.wallet',
    route: 'ManageWallets',
    icon: <WalletIcon color={COLORS.brand500} />
  },
  {
    key: 'managePermissions',
    title: 'settings.manage.permissions',
    route: 'ManagePermissions',
    icon: <GlobalFill color={COLORS.brand500} />
  },
  {
    key: 'watchlists',
    title: 'settings.watchlists',
    route: 'Watchlist',
    icon: <WatchListIcon color={COLORS.brand500} />
  },
  {
    key: 'explore',
    title: 'settings.explore',
    route: 'Explore',
    icon: <CompassIcon color={COLORS.brand500} />
  },
  {
    key: 'notificationSettings',
    title: 'settings.notifications',
    route: 'NotificationSettings',
    icon: <NotificationIcon color={COLORS.brand500} />
  },
  {
    key: 'appPreferences',
    title: 'settings.preferences',
    route: 'AppPreferences',
    icon: <Preferences color={COLORS.brand500} />
  },
  {
    key: 'securitySettings',
    title: 'settings.security',
    route: 'SecuritySettings',
    icon: <SecurityIcon color={COLORS.brand500} />
  },
  {
    key: 'about',
    title: 'settings.about',
    route: 'About',
    icon: <AboutIcon color={COLORS.brand500} />
  }
];

export const SOCIAL_GROUPS: (Omit<SettingsMenuItem, 'route'> & {
  route: 'Twitter' | 'Telegram' | 'Medium';
  key: 'xTwitter' | 'telegram' | 'medium';
})[] = [
  {
    key: 'xTwitter',
    title: 'settings.twitter',
    route: 'Twitter',
    icon: <XTwitterIcon color={COLORS.neutral400} />
  },
  {
    key: 'telegram',
    title: 'settings.telegram',
    route: 'Telegram',
    icon: <TelegramSettingsIcon color={COLORS.neutral400} />
  },
  {
    key: 'medium',
    title: 'settings.medium',
    route: 'Medium',
    icon: <MediumIcon color={COLORS.neutral400} />
  }
];
