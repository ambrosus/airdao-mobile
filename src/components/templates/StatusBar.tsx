import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useCurrentRoute } from '@contexts/Navigation';
import { COLORS } from '@constants/colors';

export const StatusBar = () => {
  const currentRoute = useCurrentRoute();
  return (
    <ExpoStatusBar
      style="dark"
      backgroundColor={currentRoute === 'HomeScreen' ? '#f3f5f7' : COLORS.white}
    />
  );
};
