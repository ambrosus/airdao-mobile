import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const ScanSquare = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
};
