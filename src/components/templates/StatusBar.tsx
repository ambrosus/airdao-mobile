import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useCurrentRoute } from '@contexts/Navigation';
import { COLORS } from '@constants/colors';

export const StatusBar = () => {
  const currentRoute = useCurrentRoute();
  return (
    <ExpoStatusBar
      style={currentRoute === 'HomeScreen' ? 'dark' : 'light'}
      backgroundColor={currentRoute === 'HomeScreen' ? '#f3f5f7' : COLORS.white}
    />
  );
};
