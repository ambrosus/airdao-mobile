import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { HomeInactiveIcon } from '@components/svg/BottomTabIcons/WalletsInactiveIcon';
import { HomeActiveIcon } from '@components/svg/BottomTabIcons/WalletsActiveIcon';
import { SearchInactiveIcon } from '@components/svg/BottomTabIcons/SearchInactiveIcon';
import { SearchActiveIcon } from '@components/svg/BottomTabIcons/SearchActiveIcon';
import { PortfolioInactiveIcon } from '@components/svg/BottomTabIcons/PortfolioInactiveIcon';
import { PortfolioActiveIcon } from '@components/svg/BottomTabIcons/PortfolioActiveIcon';
import { SettingsInactiveIcon } from '@components/svg/BottomTabIcons/SettingsInactiveIcon';
import { SettingsActiveIcon } from '@components/svg/BottomTabIcons/SettingsActiveIcon';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { Text } from '@components/base';
import { useCurrentRoute } from '@contexts/Navigation';
import { NavigationUtils } from '@utils/navigation';

type LabelType = 'Settings' | 'Portfolio' | 'Search' | 'Wallets';
const tabs = {
  Wallets: {
    inactiveIcon: <HomeInactiveIcon />,
    activeIcon: <HomeActiveIcon />
  },
  Portfolio: {
    inactiveIcon: <PortfolioInactiveIcon />,
    activeIcon: <PortfolioActiveIcon />
  },
  Search: {
    inactiveIcon: <SearchInactiveIcon />,
    activeIcon: <SearchActiveIcon />
  },
  Settings: {
    inactiveIcon: <SettingsInactiveIcon />,
    activeIcon: <SettingsActiveIcon />
  }
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const bottomSafeArea = useSafeAreaInsets().bottom - 15;
  const currentRoute = useCurrentRoute();
  const tabBarVisible = NavigationUtils.getTabBarVisibility(currentRoute);

  if (!tabBarVisible) return <></>;

  return (
    <View style={[styles.mainContainer, { paddingBottom: bottomSafeArea }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    opacity: 2,
    borderTopWidth: 0.25,
    borderTopColor: COLORS.silver
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
