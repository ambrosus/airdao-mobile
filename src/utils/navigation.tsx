const TabVisibleRoutes = [
  'HomeScreen',
  'SettingsScreen',
  'WalletScreen',
  'ProductsScreen'
];
const HarborTabVisibleRoutes = ['StakeAMB', 'StakeHBR', 'BorrowHarborScreen'];

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};
const getHarborTabBarVisibility = (route: string): boolean => {
  return HarborTabVisibleRoutes.includes(route);
};

export const NavigationUtils = {
  getTabBarVisibility,
  getHarborTabBarVisibility
};
