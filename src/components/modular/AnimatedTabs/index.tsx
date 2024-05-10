import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Button, Row, Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
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
}

export const AnimatedTabs = (props: AnimatedTabsProps) => {
  const {
    tabs,
    containerStyle,
    onSwipeStateHandle,
    dismissOnChangeIndex,
    onChangedIndex
  } = props;
  const tabCount = tabs.length;
  const scrollView = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tabWidth = DEVICE_WIDTH;
  const tabBarWidth = tabWidth / tabCount;

  const indicatorPosition = useSharedValue(0);

  // @ts-ignore
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(indicatorPosition.value) }]
    };
  });

  useEffect(() => {
    onChangedIndex && onChangedIndex(currentIndex);
    indicatorPosition.value = withTiming(currentIndex * (tabWidth / 2), {
      duration: 0
    });
  }, [currentIndex, indicatorPosition, onChangedIndex, tabWidth]);

  const scrollToTab = (idx: number) => {
    dismissOnChangeIndex && Keyboard.dismiss();
    onChangedIndex && onChangedIndex(idx);
    scrollView.current?.scrollTo({ x: tabWidth * idx, animated: true });
    setCurrentIndex(idx);
    indicatorPosition.value = withTiming(idx * tabBarWidth);
  };

  const renderTabView = (tab: AnimatedTab, idx: number): JSX.Element => {
    return (
      <View
        key={`${tab.title}-view-${idx}`}
        style={{ width: tabWidth, flex: 1 }}
      >
        {tab.view}
      </View>
    );
  };

  const renderTabBar = (tab: AnimatedTab, idx: number): JSX.Element => {
    return (
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
    );
  };

  const onScrollEnd = () => onSwipeStateHandle && onSwipeStateHandle(false);
  const onScrollStart = () => onSwipeStateHandle && onSwipeStateHandle(true);

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
              width: tabWidth / 2,
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
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const scrollOffsetX = event.nativeEvent.contentOffset.x;
          setCurrentIndex(scrollOffsetX > 0 ? 1 : 0);
        }}
        onScrollEndDrag={onScrollEnd}
        onScrollBeginDrag={onScrollStart}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {tabs.map(renderTabView)}
      </ScrollView>
    </View>
  );
};
