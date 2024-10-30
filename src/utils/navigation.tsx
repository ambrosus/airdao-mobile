const TabVisibleRoutes = [
  'HomeScreen',
  'PortfolioScreen',
  'SearchScreen',
  'SettingsScreen',
  'WalletScreen',
  'Products'
];

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};

export const NavigationUtils = { getTabBarVisibility };
