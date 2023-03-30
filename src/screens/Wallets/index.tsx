import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from '@components/base';

export const WalletsScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.headerText}>WalletsScreen</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Mersad_600SemiBold'
  }
});
