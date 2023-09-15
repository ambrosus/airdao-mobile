import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { AirDAOLogo } from '@components/svg/icons/AirDAOLogo';
import { COLORS } from '@constants/colors';

export function CircularLogo(): JSX.Element {
  return (
    <View style={styles.container}>
      <AirDAOLogo color={COLORS.neutral500} />
    </View>
  );
}
