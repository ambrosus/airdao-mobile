import React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LearnAboutAirDAO,
  PortfolioBalance,
  Wallets,
  Watchlists
} from './components';
import { styles } from './styles';

export const WalletsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" backgroundColor="#222222" />
        <PortfolioBalance
          USDBalance={3900}
          AMBBalance={1}
          balanceLast24HourChange={3.46}
          AMBPriceLast24HourChange={0}
          AMBPrice={0.01306}
        />
        <View style={styles.content}>
          <Wallets />
          <View style={styles.divider} />
          <Watchlists />
          <View style={styles.airdao}>
            <LearnAboutAirDAO />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
