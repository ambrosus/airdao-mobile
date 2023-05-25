import React from 'react';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator
} from '@react-navigation/native';
import { NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { AddressDetails } from '@screens/Address';
import { HomeParamsList, PortfolioParamsPortfolio } from '@appTypes';

const TabVisibleRoutes = [
  'HomeScreen',
  'PortfolioScreen',
  'ExploreScreen',
  'SettingsScreen'
];

const getCommonStack = (
  Stack: TypedNavigator<
    HomeParamsList | PortfolioParamsPortfolio,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    ({
      id,
      initialRouteName,
      children,
      screenListeners,
      screenOptions,
      ...rest
    }: NativeStackNavigatorProps) => JSX.Element
  >
): JSX.Element => {
  return (
    <>
      <Stack.Screen name="Address" component={AddressDetails} />
    </>
  );
};

const getTabBarVisibility = (route: string): boolean => {
  return TabVisibleRoutes.includes(route);
};

export const NavigationUtils = { getCommonStack, getTabBarVisibility };
