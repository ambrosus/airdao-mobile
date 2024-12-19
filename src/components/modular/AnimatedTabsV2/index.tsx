import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Button, Row, Text } from '@components/base';
import { DEVICE_WIDTH } from '@constants/variables';
import { scale } from '@utils';
import { styles } from './styles';

type AnimatedTab = {
  icon?: JSX.Element;
  view: JSX.Element;
  title: string;
};

interface AnimatedV2TabsProps {
  tabs: AnimatedTab[];
  dismissOnChangeIndex?: boolean;
  containerStyle?: ViewStyle;
  customTabBarStyle?: ViewStyle;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never' | undefined;
}

export const AnimatedTabsV2 = ({
  tabs,
  dismissOnChangeIndex,
  containerStyle,
  keyboardShouldPersistTaps,
  customTabBarStyle
}: AnimatedV2TabsProps) => {
  const TABS_MARGIN = scale(20);
  const TABS_LENGTH = tabs.length;
  const TAB_WIDTH = DEVICE_WIDTH;
  const tabBarWidth = TAB_WIDTH / TABS_LENGTH - TABS_MARGIN;

  const [currentIndex, setCurrentIndex] = useState(0);
  const indicatorPosition = useSharedValue(0);

  const scrollView = useRef<ScrollView>(null);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(indicatorPosition.value) }]
    };
  });

  const scrollToTab = useCallback(
    (idx: number) => {
      if (dismissOnChangeIndex) {
        Keyboard.dismiss();
      }
      scrollView.current?.scrollTo({ x: TAB_WIDTH * idx, animated: true });
      setCurrentIndex(idx);
    },
    [dismissOnChangeIndex, TAB_WIDTH]
  );

  useEffect(() => {
    indicatorPosition.value = withTiming(
      currentIndex * tabBarWidth - scale(currentIndex * 2),
      {
        duration: 0
      }
    );
  }, [currentIndex, indicatorPosition, tabBarWidth]);

  const renderTabView = (tab: AnimatedTab, idx: number): JSX.Element => {
    return (
      <View
        key={`${tab.title}-view-${idx}`}
        style={{ width: TAB_WIDTH, flex: 1 }}
      >
        {tab.view}
      </View>
    );
  };

  const renderTabBar = useCallback(
    (tab: AnimatedTab, idx: number): JSX.Element => (
      <Button
        onPress={() => scrollToTab(idx)}
        key={`${tab.title}-${idx}-bar`}
        style={{ ...styles.tabBarTitle, ...customTabBarStyle }}
      >
        {tab.icon && tab.icon}
        <Text style={styles.tabHeader}>{tab.title}</Text>
      </Button>
    ),
    [customTabBarStyle, scrollToTab]
  );

  const onMomentumScrollEndHandle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(scrollOffsetX / TAB_WIDTH);
      setCurrentIndex(newIndex);
    },
    [TAB_WIDTH]
  );

  return (
    <View style={containerStyle}>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{
          ...styles.tabContainer,
          marginHorizontal: TABS_MARGIN
        }}
      >
        <Animated.View
          style={[
            {
              ...styles.mainView,
              width: `${100 / tabs.length}%`
            },
            indicatorStyle
          ]}
        />
        {tabs.map(renderTabBar)}
      </Row>
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEndHandle}
      >
        {tabs.map(renderTabView)}
      </ScrollView>
    </View>
  );
};
