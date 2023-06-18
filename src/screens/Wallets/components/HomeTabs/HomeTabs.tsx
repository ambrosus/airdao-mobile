import { Dimensions, View } from 'react-native';
import React, { useState } from 'react';
import { TabView } from 'react-native-tab-view';
import { HomeTabsScenes } from '@screens/Wallets/components/HomeTabs/HomeTabsScenes';
import { HomeWatchlists } from '@screens/Wallets/components/HomeTabs/HomeWatchlists';
import { HomeCollections } from '@screens/Wallets/components/HomeTabs/HomeCollections';
import type { Props as TabViewProps } from 'react-native-tab-view/lib/typescript/src/TabView';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';

const homeTabRoutes = [
  { key: 'first', title: 'Watchlists' },
  { key: 'second', title: 'Collections' }
] as const;

type HomeTabRoutes = typeof homeTabRoutes;

type HomeTabViewRoute = {
  key: HomeTabRoutes[number]['key'];
  title: HomeTabRoutes[number]['title'];
};

type RenderSceneProps = Parameters<
  TabViewProps<HomeTabViewRoute>['renderScene']
>[0];
const renderScene = ({ route }: RenderSceneProps) => {
  switch (route.key) {
    case 'first':
      return <HomeWatchlists />;
    case 'second':
      return <HomeCollections />;
    default:
      return null;
  }
};

export const HomeTabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState<HomeTabViewRoute[]>(
    homeTabRoutes as unknown as HomeTabViewRoute[]
  );

  const numTabs = 4;
  const numItems = Math.min(numTabs, HomeTabsScenes.length);
  const height = numItems * (Dimensions.get('screen').height * 0.45) + 100;

  return (
    <View style={[styles.homeTabs, { height }]} testID="lists-screen">
      <TabView<HomeTabViewRoute>
        style={styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => {
          return (
            <HomeTabsScenes {...props} onIndexChange={setIndex} index={index} />
          );
        }}
      />
    </View>
  );
};
