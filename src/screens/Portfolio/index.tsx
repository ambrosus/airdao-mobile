import React, { useLayoutEffect, useState } from 'react';
import { PortfolioScreenTabs } from '@screens/Portfolio/components/PortfolioScreenTabs';
import { TabView } from 'react-native-tab-view';
import { Collections } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Collections';
import type { Props as TabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView';
import { WatchList } from '@screens/Portfolio/components/PortfolioScreenTabs/components/Watchlists';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

const portfolioTabRoutes = [
  { key: 'first', title: 'Addresses' },
  { key: 'second', title: 'Groups' }
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
  const { top } = useSafeAreaInsets();
  const activeTab = route?.params?.tabs?.activeTab;
  const [index, setIndex] = useState(0);
  const [routes] = useState<PortfolioTabViewRoute[]>(
    portfolioTabRoutes as unknown as PortfolioTabViewRoute[]
  );

  const focused = useIsFocused();

  useLayoutEffect(() => {
    if (focused && typeof activeTab === 'number') {
      setIndex(activeTab);
    }
  }, [activeTab, focused]);

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
