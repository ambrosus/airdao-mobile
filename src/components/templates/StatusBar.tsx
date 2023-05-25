import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { COLORS } from '@constants/colors';

export const StatusBar = () => {
  return <ExpoStatusBar style={'dark'} backgroundColor={COLORS.white} />;
};
