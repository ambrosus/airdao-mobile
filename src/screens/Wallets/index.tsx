import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
