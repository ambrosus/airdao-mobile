const TabVisibleRoutes = [
  'HomeScreen',
  'PortfolioScreen',
  'SearchScreen',
  'SettingsScreen'
];

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};

export const NavigationUtils = { getTabBarVisibility };
