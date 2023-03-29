import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListsOfWallets } from './components/ListsOfWallets';
import { Spacer } from '@components/atoms/Spacer';
import { COLORS } from '../../constants/colors';
import { ListsScreenHeader } from './components/ListsScreenHeader';
import { AddIcon } from '@components/svg/AddIcon';

import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatButton } from '@components/FloatButton';

export const ListsScreen = () => {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ListsScreenHeader />
        <Spacer value={32} />
        <View style={styles.lineStyle} />
        <ListsOfWallets />
      </SafeAreaView>
      <FloatButton title="Create new list" icon={<AddIcon />} />
    </>
  );
};

const styles = StyleSheet.create({
  lineStyle: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.darkGrey,
    opacity: 0.1
  }
});
