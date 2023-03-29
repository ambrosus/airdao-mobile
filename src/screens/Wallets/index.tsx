import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView } from 'react-native';
import { PortfolioBalance } from './components';
import { styles } from './styles';

export const WalletsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" backgroundColor="#222222" />
      <PortfolioBalance
        USDBalance={3900}
        AMBBalance={1}
        balanceLast24HourChange={3.46}
        AMBPriceLast24HourChange={0}
        AMBPrice={0.01306}
      />
    </ScrollView>
  );
};
