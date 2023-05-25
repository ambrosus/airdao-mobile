import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';

export function CircularLogo(): JSX.Element {
  return (
    <View style={styles.container}>
      <AirDAOLogo color="#51545a" />
    </View>
  );
}
