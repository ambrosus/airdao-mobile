import React, { useLayoutEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
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
    inactiveIcon: <WalletTabIcon color={COLORS.gray200} />,
    activeIcon: <WalletTabIcon color={COLORS.mainBlue} />
  },
  Portfolio: {
    inactiveIcon: <WatchlistTabIcon color={COLORS.gray200} />,
    activeIcon: <WatchlistTabIcon color={COLORS.mainBlue} />
  },
  Search: {
    inactiveIcon: <ExploreTabIcon color={COLORS.gray200} />,
    activeIcon: <ExploreTabIcon color={COLORS.mainBlue} />
  },
  Settings: {
    inactiveIcon: <SettingsTabIcon color={COLORS.gray200} />,
    activeIcon: <SettingsTabIcon color={COLORS.mainBlue} />
  }
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const bottomSafeArea = useSafeAreaInsets().bottom - 12;
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
        { paddingBottom: bottomSafeArea },
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
                  color: isFocused ? COLORS.mainBlue : '#676b73',
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

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    opacity: 2,
    borderTopWidth: 0.25,
    borderTopColor: COLORS.gray200
  },
  mainItemContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    backgroundColor: COLORS.white,
    opacity: 0.94
  },
  labelStyle: {
    paddingTop: 2,
    fontSize: 12,
    lineHeight: 16
  }
});

export default TabBar;
