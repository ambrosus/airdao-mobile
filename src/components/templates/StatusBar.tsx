import React, { useMemo } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { COLORS } from '@constants/colors';
import { useCurrentRoute } from '@contexts';

const RoutesWithCulturedWhiteBg = [
  'HomeScreen',
  'AMBMarketScreen',
  'WelcomeScreen'
];

export const StatusBar = () => {
  const currentRoute = useCurrentRoute();

  const backgroundColor = useMemo(() => {
    if (RoutesWithCulturedWhiteBg.includes(currentRoute))
      return COLORS.culturedWhite;
    return COLORS.neutral0;
  }, [currentRoute]);

  return <ExpoStatusBar style="dark" backgroundColor={backgroundColor} />;
};
