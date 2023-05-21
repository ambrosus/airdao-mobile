import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { TabView } from 'react-native-tab-view';
import { HomeTabsScenes } from '@screens/Wallets/components/HomeTabs/HomeTabsScenes';
import { HomeWatchlists } from '@screens/Wallets/components/HomeTabs/HomeWatchlists';
import { HomeCollections } from '@screens/Wallets/components/HomeTabs/HomeCollections';

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
  HomeTabViewRo<HomeTabViewRoute>['renderScene']
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

  return (
    <View style={styles.homeTabs} testID="lists-screen">
      <TabView<HomeTabViewRoute>
        style={{ flex: 1 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => {
          return (
            <HomeTabsScenes {...props} onIndexChange={setIndex} index={index} />
          );
        }}
      />
      {/*<Button onPress={navigateToPortfolio} style={styles.seeAllButton}>*/}
      {/*  <Text*/}
      {/*    fontFamily="Inter_600SemiBold"*/}
      {/*    fontSize={16}*/}
      {/*    color={COLORS.deepBlue}*/}
      {/*    style={{ marginVertical: 12 }}*/}
      {/*  >*/}
      {/*    See all*/}
      {/*  </Text>*/}
      {/*</Button>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  homeTabs: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24
  }
});
