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
import { styles } from './styles';
import { Button, Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils';
import { COLORS } from '@constants/colors';
import { DEVICE_WIDTH } from '@constants/variables';

type AnimatedTab = {
  view: JSX.Element;
  title: string;
};

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  containerStyle?: ViewStyle;
  onSwipeStateHandle?: (state: boolean) => void;
  dismissOnChangeIndex?: boolean;
  onChangedIndex?: (index: number) => void;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never' | undefined;
}

export const AnimatedTabs = ({
  tabs,
  containerStyle,
  onSwipeStateHandle,
  dismissOnChangeIndex,
  onChangedIndex,
  keyboardShouldPersistTaps
}: AnimatedTabsProps) => {
  const TABS_LENGTH = tabs.length;
  const TAB_WIDTH = DEVICE_WIDTH;
  const tabBarWidth = TAB_WIDTH / TABS_LENGTH;

  const [currentIndex, setCurrentIndex] = useState(0);
  const indicatorPosition = useSharedValue(0);

  const scrollView = useRef<ScrollView>(null);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(indicatorPosition.value) }]
    };
  });

  useEffect(() => {
    onChangedIndex && onChangedIndex(currentIndex);
    indicatorPosition.value = withTiming(currentIndex * tabBarWidth, {
      duration: 0
    });
  }, [currentIndex, indicatorPosition, onChangedIndex, tabBarWidth]);

  const scrollToTab = useCallback(
    (idx: number) => {
      dismissOnChangeIndex && Keyboard.dismiss();
      onChangedIndex && onChangedIndex(idx);
      scrollView.current?.scrollTo({ x: TAB_WIDTH * idx, animated: true });
      setCurrentIndex(idx);
      indicatorPosition.value = withTiming(idx * tabBarWidth);
    },
    [
      dismissOnChangeIndex,
      indicatorPosition,
      onChangedIndex,
      tabBarWidth,
      TAB_WIDTH
    ]
  );

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
        style={styles.tabBarTitle}
      >
        <Text
          fontFamily="Inter_500Medium"
          color={currentIndex === idx ? COLORS.brand500 : COLORS.midnight}
          fontSize={16}
        >
          {tab.title}
        </Text>
      </Button>
    ),
    [currentIndex, scrollToTab]
  );

  const onScrollEnd = () => onSwipeStateHandle && onSwipeStateHandle(false);
  const onScrollStart = () => onSwipeStateHandle && onSwipeStateHandle(true);

  const onMomentumScrollEndHandle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(scrollOffsetX / TAB_WIDTH);
      setCurrentIndex(newIndex);
      indicatorPosition.value = withTiming(newIndex * tabBarWidth);
    },
    [indicatorPosition, tabBarWidth, TAB_WIDTH]
  );

  return (
    <View style={containerStyle}>
      <Row alignItems="center" justifyContent="space-between">
        {tabs.map(renderTabBar)}
      </Row>
      <View style={styles.tabsIndicator}>
        <Animated.View
          style={[
            {
              position: 'relative',
              bottom: 1,
              left: 0,
              width: tabBarWidth,
              height: 2,
              backgroundColor: COLORS.brand500
            },
            indicatorStyle
          ]}
        />
      </View>
      <Spacer value={verticalScale(10)} />
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEndHandle}
        onScrollEndDrag={onScrollEnd}
        onScrollBeginDrag={onScrollStart}
      >
        {tabs.map(renderTabView)}
      </ScrollView>
    </View>
  );
};
