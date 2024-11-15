const TabVisibleRoutes = [
  'HomeScreen',
  'SettingsScreen',
  'WalletScreen',
  'ProductsScreen'
];

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};

export const NavigationUtils = { getTabBarVisibility };
