import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabView } from 'react-native-tab-view';
import { PortfolioScreenTabs } from '@screens/Settings/screens/Watchlist/components/PortfolioScreenTabs';
import { Collections } from '@screens/Settings/screens/Watchlist/components/PortfolioScreenTabs/components/Collections';
import { WatchList } from '@screens/Settings/screens/Watchlist/components/PortfolioScreenTabs/components/Watchlists';
import type { Props as TabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView';

export const Watchlist = () => {
  const portfolioTabRoutes = [
    { key: 'first', title: 'common.address_plural' },
    { key: 'second', title: 'common.group_plural' }
  ] as const;

  type PortfolioTabRoutes = typeof portfolioTabRoutes;

  type PortfolioTabViewRoute = {
    key: PortfolioTabRoutes[number]['key'];
    title: PortfolioTabRoutes[number]['title'];
  };

  type RenderSceneProps = Parameters<
    TabViewProps<PortfolioTabViewRoute>['renderScene']
  >[0];

  // tslint:disable-next-line:no-shadowed-variable
  const renderScene = ({ route }: RenderSceneProps) => {
    switch (route.key) {
      case 'first':
        return <WatchList />;
      case 'second':
        return <Collections />;
      default:
        return null;
    }
  };
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState<PortfolioTabViewRoute[]>(
    portfolioTabRoutes as unknown as PortfolioTabViewRoute[]
  );

  return (
    <View style={{ flex: 1, top }} testID="Portfolio_Screen">
      <TabView<PortfolioTabViewRoute>
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <PortfolioScreenTabs
            {...props}
            onIndexChange={setIndex}
            index={index}
          />
        )}
      />
    </View>
  );
};
