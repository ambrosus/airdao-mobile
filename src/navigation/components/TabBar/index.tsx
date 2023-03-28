import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { WalletsInactiveIcon } from '@components/svg/BottomTabIcons/WalletsInactiveIcon';
import { WalletsActiveIcon } from '@components/svg/BottomTabIcons/WalletsActiveIcon';
import { ExploreInactiveIcon } from '@components/svg/BottomTabIcons/ExploreInactiveIcon';
import { ExploreActiveIcon } from '@components/svg/BottomTabIcons/ExploreActiveIcon';
import { ListsInactiveIcon } from '@components/svg/BottomTabIcons/ListsInactiveIcon';
import { ListsActiveIcon } from '@components/svg/BottomTabIcons/ListsActiveIcon';
import { SettingsInactiveIcon } from '@components/svg/BottomTabIcons/SettingsInactiveIcon';
import { SettingsActiveIcon } from '@components/svg/BottomTabIcons/SettingsActiveIcon';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LabelType = 'Settings' | 'Lists' | 'Explore' | 'Wallets';
const tabs = {
  Wallets: {
    inactiveIcon: <WalletsInactiveIcon />,
    activeIcon: <WalletsActiveIcon />
  },
  Explore: {
    inactiveIcon: <ExploreInactiveIcon />,
    activeIcon: <ExploreActiveIcon />
  },
  Lists: {
    inactiveIcon: <ListsInactiveIcon />,
    activeIcon: <ListsActiveIcon />
  },
  Settings: {
    inactiveIcon: <SettingsInactiveIcon />,
    activeIcon: <SettingsActiveIcon />
  }
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const bottomSafeArea = useSafeAreaInsets().bottom - 15;
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

        const icon = tabs[label][isFocused ? 'activeIcon' : 'inactiveIcon'];

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
              style={{
                color: isFocused ? '#222222' : '#2f2b43',
                paddingTop: 2,
                fontSize: 12,
                opacity: isFocused ? 1 : 0.7,
                lineHeight: 16
              }}
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
    backgroundColor: 'rgba(249, 249, 249, 0.94)',
    paddingVertical: 8,
    alignItems: 'center',
    textAlign: 'center',
    opacity: 2,
    borderTopWidth: 0.25,
    borderTopColor: 'rgba(0, 0, 0, 0.2)\n'
  },
  mainItemContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    backgroundColor: '#F9F9F9',
    opacity: 0.94
  }
});

export default TabBar;
