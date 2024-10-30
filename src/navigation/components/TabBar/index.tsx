import React, { useLayoutEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { useCurrentRoute } from '@contexts/Navigation';
import { NavigationUtils } from '@utils/navigation';
import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { isIos } from '@utils/isPlatform';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { WalletsInactiveIcon } from '@components/svg/icons/v2/bottom-tabs-navigation/wallets-inactive';
import { WalletsActiveIcon } from '@components/svg/icons/v2/bottom-tabs-navigation/wallets-active';
import {
  ProductsActiveIcon,
  ProductsInactiveIcon,
  SettingsActiveIcon,
  SettingsInactiveIcon
} from '@components/svg/icons/v2/bottom-tabs-navigation';
import { scale, verticalScale } from '@utils/scaling';

type LabelType = 'Settings' | 'Products' | 'Wallets';
const tabs = {
  Wallets: {
    inactiveIcon: <WalletsInactiveIcon color={COLORS.neutral200} />,
    activeIcon: <WalletsActiveIcon color={COLORS.brand600} />
  },
  Products: {
    inactiveIcon: <ProductsInactiveIcon color={COLORS.neutral800} />,
    activeIcon: <ProductsActiveIcon color={COLORS.brand600} />
  },
  Settings: {
    inactiveIcon: <SettingsInactiveIcon color={COLORS.neutral200} />,
    activeIcon: <SettingsActiveIcon color={COLORS.brand600} />
  }
};

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
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
          paddingBottom: bottomSafeArea * 1.75
        },
        animatedStyle
      ]}
    >
      {state.routes.map((route: any, index: number) => {
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
            if (route.name === 'Portfolio') {
              sendFirebaseEvent(CustomAppEvents.watchlist_page);
            }
            if (route.name === 'Search') {
              sendFirebaseEvent(CustomAppEvents.explorer_page);
            }
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={index}
            hitSlop={scale(24)}
            style={[
              styles.mainItemContainer,
              {
                paddingTop: verticalScale(index === 1 ? 8 : 17)
              }
            ]}
            onPress={onPress}
          >
            {icon}
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    bottom: 0,
    backgroundColor: COLORS.neutral0,
    opacity: 2,
    elevation: 0.25,
    borderTopWidth: isIos ? 0.25 : 0.5,
    borderTopColor: COLORS.neutral200
  },
  mainItemContainer: {
    width: 40,
    height: 24,
    alignItems: 'center',
    backgroundColor: COLORS.neutral0
  }
});

export default TabBar;
