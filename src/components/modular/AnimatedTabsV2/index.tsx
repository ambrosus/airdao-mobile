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
import { Button, Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from './styles';
import { DEVICE_WIDTH } from '@constants/variables';

type AnimatedTab = {
  icon?: JSX.Element;
  view: JSX.Element;
  title: string;
};

interface AnimatedV2TabsProps {
  tabs: AnimatedTab[];
  dismissOnChangeIndex?: boolean;
  containerStyle?: ViewStyle;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never' | undefined;
}

export const AnimatedTabsV2 = ({
  tabs,
  dismissOnChangeIndex,
  containerStyle,
  keyboardShouldPersistTaps
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
        style={styles.tabBarTitle}
      >
        {tab.icon && (
          <View>
            {tab.icon}
            <Spacer value={scale(20)} horizontal />
          </View>
        )}
        <Text fontFamily="Inter_700Bold" color={COLORS.midnight} fontSize={16}>
          {tab.title}
        </Text>
      </Button>
    ),
    [scrollToTab]
  );

  const onScrollEnd = () => {
    // do nothing
  };
  const onScrollStart = () => {
    // do nothing
  };

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
              position: 'absolute',
              width: `${100 / tabs.length}%`,
              borderRadius: 24,
              height: '100%',
              backgroundColor: 'white'
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
        onScrollEndDrag={onScrollEnd}
        onScrollBeginDrag={onScrollStart}
      >
        {tabs.map(renderTabView)}
      </ScrollView>
    </View>
  );
};
