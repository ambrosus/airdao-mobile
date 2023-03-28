import React from 'react';
import { SafeAreaView, View, StyleSheet, Pressable, Text } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/atoms/Spacer';
import { COLORS } from '../../constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';

export const ListsScreen = () => {
  return (
    <>
      <SafeAreaView>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.lineStyle} />
        <ListsOfWallets />
      </SafeAreaView>
      <Pressable style={styles.buttonStyle}>
        <Text
          style={{
            justifyContent: 'center',
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            paddingVertical: 16,
            color: COLORS.white
          }}
        >
          Create new list
        </Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.darkGrey,
    opacity: 0.1
  },
  buttonStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
    backgroundColor: COLORS.grey,
    borderRadius: 24,
    paddingHorizontal: 120
  }
});
