import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PortfolioScreenTabs } from '@screens/Portfolio/components/PortfolioScreenTabs';
import { TabView } from 'react-native-tab-view';
import { Collections } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Collections';
import type { Props as TabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView';
import { WatchList } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Watchlists';

const portfolioTabRoutes = [
  { key: 'first', title: 'Watchlists' },
  { key: 'second', title: 'Collections' }
] as const;

type PortfolioTabRoutes = typeof portfolioTabRoutes;

type PortfolioTabViewRoute = {
  key: PortfolioTabRoutes[number]['key'];
  title: PortfolioTabRoutes[number]['title'];
};

type RenderSceneProps = Parameters<
  TabViewProps<PortfolioTabViewRoute>['renderScene']
>[0];

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

export const PortfolioScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState<PortfolioTabViewRoute[]>(
    portfolioTabRoutes as unknown as PortfolioTabViewRoute[]
  );
  return (
    <SafeAreaView style={{ flex: 1 }} testID="Portfolio_Screen">
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
    </SafeAreaView>
  );
};
