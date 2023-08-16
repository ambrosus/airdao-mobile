const TabVisibleRoutes = [
  'HomeScreen',
  'PortfolioScreen',
  'SearchScreen',
  'SettingsScreen',
  'WalletScreen'
];

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};

export const NavigationUtils = { getTabBarVisibility };
