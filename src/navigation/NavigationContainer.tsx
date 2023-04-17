import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './stacks/RootStack';
import { navTheme } from '@constants/navTheme';
import { useCachePurifier } from '@hooks/useCachePurifier';

const Navigation = () => {
  useCachePurifier();
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack />
    </NavigationContainer>
  );
};

export default Navigation;
