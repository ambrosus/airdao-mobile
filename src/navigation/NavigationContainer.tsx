import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './stacks/RootStack';
import { navTheme } from '../constants/navTheme';

const Navigation = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack />
    </NavigationContainer>
  );
};

export default Navigation;
