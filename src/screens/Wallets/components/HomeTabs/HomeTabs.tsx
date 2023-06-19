import { Dimensions, ScrollView, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { HomeWatchlists } from '@screens/Wallets/components/HomeTabs/HomeWatchlists';
import { HomeCollections } from '@screens/Wallets/components/HomeTabs/HomeCollections';
import { styles } from '@screens/Wallets/components/HomeTabs/styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { COLORS } from '@constants/colors';
import { BottomSheetCreateCollectionOrAddAddress } from '@components/templates/BottomSheetCreateCollectionOrAddAddress';
import { BottomSheetRef } from '@components/composite';
import { SearchTabNavigationProp } from '@appTypes';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetCreateRenameGroup } from '@components/templates/BottomSheetCreateRenameGroup';
import { useLists } from '@contexts';

export const HomeTabs = () => {
  const navigation = useNavigation<SearchTabNavigationProp>();
  const { handleOnCreate } = useLists((v) => v);

  const scrollView = useRef<ScrollView>(null);
  const createCollectionOrAddAddressRef = useRef<BottomSheetRef>(null);
  const createRenameGroupRef = useRef<BottomSheetRef>(null);
  const tabWidth = Dimensions.get('window').width - scale(32);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnCreateCollectionOrAddAddress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.show();
  }, []);

  const handleOnAddNewAddress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.dismiss();

    setTimeout(
      () => navigation.navigate('Search', { screen: 'SearchScreen' }),
      400
    );
  }, [navigation]);

  const handleCreateCollectionPress = useCallback(() => {
    createCollectionOrAddAddressRef.current?.dismiss();
    setTimeout(() => createRenameGroupRef.current?.show(), 400);
  }, []);

  const seeAll = useCallback(() => {
    navigation.navigate('Portfolio', {
      screen: 'PortfolioScreen',
      params: {
        tabs: { activeTab: currentIndex }
      }
    });
  }, [currentIndex, navigation]);

  const scrollToWatchlist = () => {
    scrollView.current?.scrollTo({ x: 0, animated: true });
    setCurrentIndex(0);
  };

  const scrollToCollections = () => {
    scrollView.current?.scrollTo({ x: tabWidth, animated: true });
    setCurrentIndex(1);
  };

  // TODO implement nice color animation switch when index changes

  return (
    <View style={styles.homeTabs}>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingHorizontal: scale(24)
        }}
      >
        <Row alignItems="center">
          <Button onPress={scrollToWatchlist}>
            <Text
              fontFamily="Inter_700Bold"
              color={currentIndex === 0 ? COLORS.jetBlack : COLORS.lavenderGray}
              fontSize={currentIndex === 0 ? 20 : 18}
            >
              Watchlist
            </Text>
          </Button>
          <Spacer value={scale(16)} horizontal />
          <Button onPress={scrollToCollections}>
            <Text
              fontFamily="Inter_700Bold"
              color={currentIndex === 1 ? COLORS.jetBlack : COLORS.lavenderGray}
              fontSize={currentIndex === 1 ? 20 : 18}
            >
              Collections
            </Text>
          </Button>
        </Row>
        <Button
          type="circular"
          onPress={handleOnCreateCollectionOrAddAddress}
          style={styles.addButton}
        >
          <AddIcon color={COLORS.white} scale={0.8} />
        </Button>
      </Row>
      <Spacer value={verticalScale(28)} />
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        testID="lists-screen"
        onMomentumScrollEnd={(event) => {
          const scrollOffsetX = event.nativeEvent.contentOffset.x;
          setCurrentIndex(scrollOffsetX > 0 ? 1 : 0);
        }}
      >
        <View style={{ width: tabWidth }}>
          <HomeWatchlists />
        </View>
        <View style={{ width: tabWidth }}>
          <HomeCollections />
        </View>
        {/* <TabView<HomeTabViewRoute>
        style={styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => {
          return (
            <HomeTabsScenes {...props} onIndexChange={setIndex} index={index} />
          );
        }}
      /> */}
      </ScrollView>
      <Spacer value={verticalScale(24)} />
      <Button onPress={seeAll} style={styles.seeAllButton}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={COLORS.deepBlue}
        >
          See all
        </Text>
      </Button>
      <BottomSheetCreateCollectionOrAddAddress
        handleOnAddNewAddress={handleOnAddNewAddress}
        handleCreateCollectionPress={handleCreateCollectionPress}
        ref={createCollectionOrAddAddressRef}
      />
      <BottomSheetCreateRenameGroup
        type="create"
        ref={createRenameGroupRef}
        handleOnCreateGroup={handleOnCreate}
      />
    </View>
  );
};
