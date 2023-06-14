import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PortfolioScreenTabs } from '@screens/Portfolio/components/PortfolioScreenTabs';
import { TabView } from 'react-native-tab-view';
import { Collections } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Collections';
import type { Props as TabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView';
import { WatchList } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Watchlists';
import { useIsFocused } from '@react-navigation/native';

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

type PortfolioScreenProps = {
  route: {
    params: {
      tabs: { activeTab: number };
    };
  };
};

export const PortfolioScreen = ({ route }: PortfolioScreenProps) => {
  const { activeTab = 0 } = route.params?.tabs;

  const [index, setIndex] = useState(activeTab);
  const [routes] = useState<PortfolioTabViewRoute[]>(
    portfolioTabRoutes as unknown as PortfolioTabViewRoute[]
  );

  const focused = useIsFocused();

  useLayoutEffect(() => {
    if (focused) {
      setIndex(activeTab);
    }
  }, [activeTab, focused]);

  return (
    <SafeAreaView style={{ flex: 1 }} testID="lists-screen">
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
