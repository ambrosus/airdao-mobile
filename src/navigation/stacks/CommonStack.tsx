import React from 'react';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator
} from '@react-navigation/native';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { HomeParamsList, PortfolioParamsPortfolio } from '@appTypes';
import { AddressDetails } from '@screens/Address';
import { Explore } from '@screens/Settings/screens/Explore';

export const getCommonStack = (
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
      <Stack.Screen name="Explore" component={Explore} />
    </>
  );
};
