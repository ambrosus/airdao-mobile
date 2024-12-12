const TabVisibleRoutes = [
  'HomeScreen',
  'SettingsScreen',
  'WalletScreen',
  'ProductsScreen'
];

// disabled tab bar on Harbor.
const HarborTabVisibleRoutes = [''];
// const HarborTabVisibleRoutes = ['StakeAMB', 'StakeHBR', 'BorrowHarborScreen'];

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
