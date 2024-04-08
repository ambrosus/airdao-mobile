import React, { useLayoutEffect, useState } from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { Text } from '@components/base';
import { useCurrentRoute } from '@contexts/Navigation';
import { NavigationUtils } from '@utils/navigation';
import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import {
  ExploreTabIcon,
  WatchlistTabIcon,
  SettingsTabIcon,
  WalletTabIcon
} from '@components/svg/BottomTabIcons';

type LabelType = 'Settings' | 'Portfolio' | 'Search' | 'Wallets';
const tabs = {
  Wallets: {
    inactiveIcon: <WalletTabIcon color={COLORS.neutral200} />,
    activeIcon: <WalletTabIcon color={COLORS.brand600} />
  },
  Portfolio: {
    inactiveIcon: <WatchlistTabIcon color={COLORS.neutral200} />,
    activeIcon: <WatchlistTabIcon color={COLORS.brand600} />
  },
  Search: {
    inactiveIcon: <ExploreTabIcon color={COLORS.neutral200} />,
    activeIcon: <ExploreTabIcon color={COLORS.brand600} />
  },
  Settings: {
    inactiveIcon: <SettingsTabIcon color={COLORS.neutral200} />,
    activeIcon: <SettingsTabIcon color={COLORS.brand600} />
  }
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const bottomSafeArea = useSafeAreaInsets().bottom;
  const currentRoute = useCurrentRoute();
  const tabBarVisible = NavigationUtils.getTabBarVisibility(currentRoute);
  const [isReady, setIsReady] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = tabBarVisible ? 1 : 0;
    return {
      opacity: withTiming(opacity, { duration: 200 })
    };
  });

  useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  useFocusEffect(() => {
    // Reset the tab bar animation when it gains focus
    animatedStyle.opacity = withTiming(1, { duration: 200 });
  });

  if (!isReady || !tabBarVisible) return <></>;

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {
          paddingBottom: bottomSafeArea
        },
        animatedStyle
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label: LabelType =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const icon =
          tabs[route.name as LabelType][
            isFocused ? 'activeIcon' : 'inactiveIcon'
          ];

        const onPress = () => {
          // @ts-ignore
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={index}
            style={[styles.mainItemContainer]}
            onPress={onPress}
          >
            {icon}
            <Text
              style={[
                styles.labelStyle,
                {
                  color: isFocused ? COLORS.brand600 : '#676b73',
                  opacity: isFocused ? 1 : 0.7
                }
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const borderTopWidth = Platform.select({
  android: 0.5,
  ios: 0.25
});

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.neutral0,
    opacity: 2,
    elevation: 0.25,
    borderTopWidth,
    borderTopColor: COLORS.neutral200
  },
  mainItemContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    backgroundColor: COLORS.neutral0,
    opacity: 0.94
  },
  labelStyle: {
    paddingTop: 2,
    fontSize: 12,
    lineHeight: 16
  }
});

export default TabBar;
