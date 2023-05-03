import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useCurrentRoute } from '@contexts/Navigation';
import { COLORS } from '@constants/colors';

export const StatusBar = () => {
  const currentRoute = useCurrentRoute();
  return (
    <ExpoStatusBar
      style={currentRoute === 'WalletsScreen' ? 'light' : 'dark'}
      backgroundColor={
        currentRoute === 'WalletsScreen' ? COLORS.deepBlue : COLORS.white
      }
    />
  );
};
