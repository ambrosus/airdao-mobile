import { LogoSVG } from '@components/svg/icons';
import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export function CircularLogo(): JSX.Element {
  return (
    <View style={styles.container}>
      <LogoSVG />
    </View>
  );
}
